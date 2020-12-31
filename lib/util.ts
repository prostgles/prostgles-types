import { md5 } from "./md5";

export function stableStringify (data, opts) {
  if (!opts) opts = {};
  if (typeof opts === 'function') opts = { cmp: opts };
  var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;

  var cmp = opts.cmp && (function (f) {
      return function (node) {
          return function (a, b) {
            var aobj = { key: a, value: node[a] };
            var bobj = { key: b, value: node[b] };
            return f(aobj, bobj);
          };
      };
  })(opts.cmp);

  var seen = [];
  return (function stringify (node) {
      if (node && node.toJSON && typeof node.toJSON === 'function') {
          node = node.toJSON();
      }

      if (node === undefined) return;
      if (typeof node == 'number') return isFinite(node) ? '' + node : 'null';
      if (typeof node !== 'object') return JSON.stringify(node);

      var i, out;
      if (Array.isArray(node)) {
          out = '[';
          for (i = 0; i < node.length; i++) {
              if (i) out += ',';
              out += stringify(node[i]) || 'null';
          }
          return out + ']';
      }

      if (node === null) return 'null';

      if (seen.indexOf(node) !== -1) {
          if (cycles) return JSON.stringify('__cycle__');
          throw new TypeError('Converting circular structure to JSON');
      }

      var seenIndex = seen.push(node) - 1;
      var keys = Object.keys(node).sort(cmp && cmp(node));
      out = '';
      for (i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = stringify(node[key]);

          if (!value) continue;
          if (out) out += ',';
          out += JSON.stringify(key) + ':' + value;
      }
      seen.splice(seenIndex, 1);
      return '{' + out + '}';
  })(data);
};


export type TextPatch = {
    from: number;
    to: number;
    text: string;
    md5: string;
}

export function getTextPatch(oldStr: string, newStr: string): TextPatch | string {

    /* Big change, no point getting diff */
    if(!oldStr || !newStr || !oldStr.trim().length || !newStr.trim().length) return newStr;


    function findLastIdx(direction = 1){

        let idx = direction < 1? -1 : 0, found = false;
        while(!found && Math.abs(idx) <= newStr.length){
            const args = direction < 1? [idx] : [0, idx];

            let os = oldStr.slice(...args),
                ns = newStr.slice(...args);

            if(os !== ns) found = true;
            else idx += Math.sign(direction) * 1;
        }

        return idx;
    }

    let from = findLastIdx() - 1,
        to = oldStr.length + findLastIdx(-1) + 1,
        toNew = newStr.length + findLastIdx(-1) + 1;
    return {
        from,
        to,
        text: newStr.slice(from, toNew),
        md5: md5(newStr)
    }
}


export function unpatchText(original: string, from: number, to: number, text: string, md5Hash?: string): string {
    if(text === null || original === null) return text;
    let res = original.slice(0, from) + text + original.slice(to);
    if(md5Hash && md5(res) !== md5Hash) throw "Patch text error: Could not match md5 hash";
    return res;
}


/* Replication */
export type SyncTableInfo = { 
    id_fields: string[];
    synced_field: string;
    throttle: number;
    batch_size: number;
};
export type WALItem = {
    idObj: any;
    delta: any;
    deleted?: boolean;
};



export type WALConfig = SyncTableInfo & {
    onSendStart?: () => any; 
    onSend: (items: WALItem[]) => Promise<any>;
    onSendEnd?: () => any;
};
export class WAL {
    private changed: { [key: string]: any  } = {};
    private sending: { [key: string]: any  } = {};
    private options: WALConfig;
    
    constructor(args: WALConfig){
        this.options = { ...args };
    }

    getIdStr(d){
        return this.options.id_fields.sort().map(key => `${d[key] || ""}`).join(".");
    }
    getIdObj(d){
        let res = {};
        this.options.id_fields.sort().map(key => {
            res[key] = d[key];
        });
        return res;
    }

    addData = (data: any[]) => {
        data.map(d => {
            const idStr = this.getIdStr(d);
            this.changed = this.changed || {};
            this.changed[idStr] = { ...this.changed[idStr], ...d };
        });
        this.sendItems();
    }
    
    isSendingTimeout = null;
    isSending: boolean = false;
    private sendItems = async () => {
        
        // Sending data. stop here
        if(this.isSendingTimeout || this.sending && !isEmpty(this.sending)) return;

        // Nothing to send. stop here
        if(!this.changed || isEmpty(this.changed)) return;
        
        // Prepare batch to send
        let batch = [];
        Object.keys(this.changed)
            .slice(0, this.options.batch_size)
            .map(key => {
                let item = { ...this.changed[key] };
                this.sending[key] = item;
                batch.push({ ...item.delta, ...item.idObj })
                delete this.changed[key];
            });

        // Throttle next data send
        this.isSendingTimeout = setTimeout(() => {
            this.isSendingTimeout = null;
            if(!isEmpty(this.changed)){
                this.sendItems();
            }
        }, this.options.throttle);

        if(this.options.onSendStart) this.options.onSendStart();
        
        try {
            await this.options.onSend(batch);//, deletedData);
            this.sending = {};
            if(!isEmpty(this.changed)){
                this.sendItems();
            } else {
                if(this.options.onSendEnd) this.options.onSendEnd();
            }
        } catch(err) {
            
            console.error(err)
        }
    };
}

export function isEmpty(obj?: object): boolean {
    for(var v in obj) return false;
    return true;
}
