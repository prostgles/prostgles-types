!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var i=t();for(var n in i)("object"==typeof exports?exports:e)[n]=i[n]}}(this||window,(()=>(()=>{"use strict";var e={31:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CONTENT_TYPE_TO_EXT=void 0,t.CONTENT_TYPE_TO_EXT={"text/html":["html","htm","shtml"],"text/css":["css"],"text/csv":["csv"],"text/tsv":["tsv"],"text/xml":["xml"],"text/mathml":["mml"],"text/plain":["txt"],"text/vnd.sun.j2me.app-descriptor":["jad"],"text/vnd.wap.wml":["wml"],"text/x-component":["htc"],"image/gif":["gif"],"image/jpeg":["jpeg","jpg"],"image/png":["png"],"image/tiff":["tif","tiff"],"image/vnd.wap.wbmp":["wbmp"],"image/x-icon":["ico"],"image/x-jng":["jng"],"image/x-ms-bmp":["bmp"],"image/svg+xml":["svg"],"image/webp":["webp"],"application/sql":["sql"],"application/x-javascript":["js"],"application/atom+xml":["atom"],"application/rss+xml":["rss"],"application/java-archive":["jar","war","ear"],"application/mac-binhex40":["hqx"],"application/msword":["doc","docx"],"application/pdf":["pdf"],"application/postscript":["ps","eps","ai"],"application/rtf":["rtf"],"application/vnd.ms-excel":["xls","xlsx"],"application/vnd.ms-powerpoint":["ppt","pptx"],"application/vnd.wap.wmlc":["wmlc"],"application/vnd.google-earth.kml+xml":["kml"],"application/vnd.google-earth.kmz":["kmz"],"application/x-7z-compressed":["7z"],"application/x-cocoa":["cco"],"application/x-java-archive-diff":["jardiff"],"application/x-java-jnlp-file":["jnlp"],"application/x-makeself":["run"],"application/x-perl":["pl","pm"],"application/x-pilot":["prc","pdb"],"application/x-rar-compressed":["rar"],"application/x-redhat-package-manager":["rpm"],"application/x-sea":["sea"],"application/x-shockwave-flash":["swf"],"application/x-stuffit":["sit"],"application/x-tcl":["tcl","tk"],"application/x-x509-ca-cert":["der","pem","crt"],"application/x-xpinstall":["xpi"],"application/xhtml+xml":["xhtml"],"application/zip":["zip"],"application/octet-stream":["bin","exe","dll","deb","dmg","eot","iso","img","msi","msp","msm"],"audio/midi":["mid","midi","kar"],"audio/mpeg":["mp3"],"audio/ogg":["ogg"],"audio/x-realaudio":["ra"],"video/3gpp":["3gpp","3gp"],"video/mpeg":["mpeg","mpg"],"video/quicktime":["mov"],"video/x-flv":["flv"],"video/x-mng":["mng"],"video/x-ms-asf":["asx","asf"],"video/x-ms-wmv":["wmv"],"video/x-msvideo":["avi"],"video/mp4":["m4v","mp4"],"video/webm":["webm"]}},444:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EXISTS_KEYS=t.GeomFilter_Funcs=t.GeomFilterKeys=t.ArrayFilterOperands=t.TextFilter_FullTextSearchFilterKeys=t.TextFilterFTSKeys=t.TextFilterKeys=t.CompareInFilterKeys=t.CompareFilterKeys=void 0,t.CompareFilterKeys=["=","$eq","<>",">","<",">=","<=","$eq","$ne","$gt","$gte","$lte"],t.CompareInFilterKeys=["$in","$nin"],t.TextFilterKeys=["$ilike","$like"],t.TextFilterFTSKeys=["@@","@>","<@","$contains","$containedBy"],t.TextFilter_FullTextSearchFilterKeys=["to_tsquery","plainto_tsquery","phraseto_tsquery","websearch_to_tsquery"],t.ArrayFilterOperands=[...t.TextFilterFTSKeys,"&&","$overlaps"],t.GeomFilterKeys=["~","~=","@","|&>","|>>",">>","=","<<|","<<","&>","&<|","&<","&&&","&&"];const i=["ST_MakeEnvelope","ST_MakePolygon"];t.GeomFilter_Funcs=i.concat(i.map((e=>e.toLowerCase()))),t.EXISTS_KEYS=["$exists","$notExists","$existsJoined","$notExistsJoined"]},590:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var r=Object.getOwnPropertyDescriptor(t,i);r&&!("get"in r?!t.__esModule:r.writable||r.configurable)||(r={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,r)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),r=this&&this.__exportStar||function(e,t){for(var i in e)"default"===i||Object.prototype.hasOwnProperty.call(t,i)||n(t,e,i)};Object.defineProperty(t,"__esModule",{value:!0}),t.CONTENT_TYPE_TO_EXT=t.getKeys=t.isObject=t.isDefined=t.get=t.WAL=t.unpatchText=t.stableStringify=t.isEmpty=t.getTextPatch=t.omitKeys=t.pickKeys=t.asName=t.RULE_METHODS=t.CHANNELS=t.TS_PG_Types=t._PG_geometric=t._PG_postgis=t._PG_date=t._PG_bool=t._PG_json=t._PG_numbers=t._PG_strings=void 0,t._PG_strings=["bpchar","char","varchar","text","citext","uuid","bytea","time","timetz","interval","name","cidr","inet","macaddr","macaddr8","int4range","int8range","numrange","tsvector"],t._PG_numbers=["int2","int4","int8","float4","float8","numeric","money","oid"],t._PG_json=["json","jsonb"],t._PG_bool=["bool"],t._PG_date=["date","timestamp","timestamptz"],t._PG_postgis=["geometry","geography"],t._PG_geometric=["point","line","lseg","box","path","polygon","circle"],t.TS_PG_Types={string:[...t._PG_strings,"lseg"],number:t._PG_numbers,boolean:t._PG_bool,Date:t._PG_date,"Array<number>":t._PG_numbers.map((e=>`_${e}`)),"Array<boolean>":t._PG_bool.map((e=>`_${e}`)),"Array<string>":t._PG_strings.map((e=>`_${e}`)),"Array<Object>":t._PG_json.map((e=>`_${e}`)),"Array<Date>":t._PG_date.map((e=>`_${e}`)),any:[]};const s="_psqlWS_.";t.CHANNELS={SCHEMA_CHANGED:s+"schema-changed",SCHEMA:s+"schema",DEFAULT:s,SQL:"_psqlWS_.sql",METHOD:"_psqlWS_.method",NOTICE_EV:"_psqlWS_.notice",LISTEN_EV:"_psqlWS_.listen",REGISTER:"_psqlWS_.register",LOGIN:"_psqlWS_.login",LOGOUT:"_psqlWS_.logout",AUTHGUARD:"_psqlWS_.authguard",CONNECTION:"_psqlWS_.connection",_preffix:s},t.RULE_METHODS={getColumns:["getColumns"],getInfo:["getInfo"],insert:["insert","upsert"],update:["update","upsert","updateBatch"],select:["findOne","find","count","size"],delete:["delete","remove"],sync:["sync","unsync"],subscribe:["unsubscribe","subscribe","subscribeOne"]};var o=i(128);Object.defineProperty(t,"asName",{enumerable:!0,get:function(){return o.asName}}),Object.defineProperty(t,"pickKeys",{enumerable:!0,get:function(){return o.pickKeys}}),Object.defineProperty(t,"omitKeys",{enumerable:!0,get:function(){return o.omitKeys}}),Object.defineProperty(t,"getTextPatch",{enumerable:!0,get:function(){return o.getTextPatch}}),Object.defineProperty(t,"isEmpty",{enumerable:!0,get:function(){return o.isEmpty}}),Object.defineProperty(t,"stableStringify",{enumerable:!0,get:function(){return o.stableStringify}}),Object.defineProperty(t,"unpatchText",{enumerable:!0,get:function(){return o.unpatchText}}),Object.defineProperty(t,"WAL",{enumerable:!0,get:function(){return o.WAL}}),Object.defineProperty(t,"get",{enumerable:!0,get:function(){return o.get}}),Object.defineProperty(t,"isDefined",{enumerable:!0,get:function(){return o.isDefined}}),Object.defineProperty(t,"isObject",{enumerable:!0,get:function(){return o.isObject}}),Object.defineProperty(t,"getKeys",{enumerable:!0,get:function(){return o.getKeys}}),r(i(444),t);var a=i(31);Object.defineProperty(t,"CONTENT_TYPE_TO_EXT",{enumerable:!0,get:function(){return a.CONTENT_TYPE_TO_EXT}})},899:(e,t)=>{function i(e,t){var i=e[0],n=e[1],c=e[2],l=e[3];i=r(i,n,c,l,t[0],7,-680876936),l=r(l,i,n,c,t[1],12,-389564586),c=r(c,l,i,n,t[2],17,606105819),n=r(n,c,l,i,t[3],22,-1044525330),i=r(i,n,c,l,t[4],7,-176418897),l=r(l,i,n,c,t[5],12,1200080426),c=r(c,l,i,n,t[6],17,-1473231341),n=r(n,c,l,i,t[7],22,-45705983),i=r(i,n,c,l,t[8],7,1770035416),l=r(l,i,n,c,t[9],12,-1958414417),c=r(c,l,i,n,t[10],17,-42063),n=r(n,c,l,i,t[11],22,-1990404162),i=r(i,n,c,l,t[12],7,1804603682),l=r(l,i,n,c,t[13],12,-40341101),c=r(c,l,i,n,t[14],17,-1502002290),i=s(i,n=r(n,c,l,i,t[15],22,1236535329),c,l,t[1],5,-165796510),l=s(l,i,n,c,t[6],9,-1069501632),c=s(c,l,i,n,t[11],14,643717713),n=s(n,c,l,i,t[0],20,-373897302),i=s(i,n,c,l,t[5],5,-701558691),l=s(l,i,n,c,t[10],9,38016083),c=s(c,l,i,n,t[15],14,-660478335),n=s(n,c,l,i,t[4],20,-405537848),i=s(i,n,c,l,t[9],5,568446438),l=s(l,i,n,c,t[14],9,-1019803690),c=s(c,l,i,n,t[3],14,-187363961),n=s(n,c,l,i,t[8],20,1163531501),i=s(i,n,c,l,t[13],5,-1444681467),l=s(l,i,n,c,t[2],9,-51403784),c=s(c,l,i,n,t[7],14,1735328473),i=o(i,n=s(n,c,l,i,t[12],20,-1926607734),c,l,t[5],4,-378558),l=o(l,i,n,c,t[8],11,-2022574463),c=o(c,l,i,n,t[11],16,1839030562),n=o(n,c,l,i,t[14],23,-35309556),i=o(i,n,c,l,t[1],4,-1530992060),l=o(l,i,n,c,t[4],11,1272893353),c=o(c,l,i,n,t[7],16,-155497632),n=o(n,c,l,i,t[10],23,-1094730640),i=o(i,n,c,l,t[13],4,681279174),l=o(l,i,n,c,t[0],11,-358537222),c=o(c,l,i,n,t[3],16,-722521979),n=o(n,c,l,i,t[6],23,76029189),i=o(i,n,c,l,t[9],4,-640364487),l=o(l,i,n,c,t[12],11,-421815835),c=o(c,l,i,n,t[15],16,530742520),i=a(i,n=o(n,c,l,i,t[2],23,-995338651),c,l,t[0],6,-198630844),l=a(l,i,n,c,t[7],10,1126891415),c=a(c,l,i,n,t[14],15,-1416354905),n=a(n,c,l,i,t[5],21,-57434055),i=a(i,n,c,l,t[12],6,1700485571),l=a(l,i,n,c,t[3],10,-1894986606),c=a(c,l,i,n,t[10],15,-1051523),n=a(n,c,l,i,t[1],21,-2054922799),i=a(i,n,c,l,t[8],6,1873313359),l=a(l,i,n,c,t[15],10,-30611744),c=a(c,l,i,n,t[6],15,-1560198380),n=a(n,c,l,i,t[13],21,1309151649),i=a(i,n,c,l,t[4],6,-145523070),l=a(l,i,n,c,t[11],10,-1120210379),c=a(c,l,i,n,t[2],15,718787259),n=a(n,c,l,i,t[9],21,-343485551),e[0]=u(i,e[0]),e[1]=u(n,e[1]),e[2]=u(c,e[2]),e[3]=u(l,e[3])}function n(e,t,i,n,r,s){return t=u(u(t,e),u(n,s)),u(t<<r|t>>>32-r,i)}function r(e,t,i,r,s,o,a){return n(t&i|~t&r,e,t,s,o,a)}function s(e,t,i,r,s,o,a){return n(t&r|i&~r,e,t,s,o,a)}function o(e,t,i,r,s,o,a){return n(t^i^r,e,t,s,o,a)}function a(e,t,i,r,s,o,a){return n(i^(t|~r),e,t,s,o,a)}function c(e){var t,i=[];for(t=0;t<64;t+=4)i[t>>2]=e.charCodeAt(t)+(e.charCodeAt(t+1)<<8)+(e.charCodeAt(t+2)<<16)+(e.charCodeAt(t+3)<<24);return i}Object.defineProperty(t,"__esModule",{value:!0}),t.md5=t.md5cycle=void 0,t.md5cycle=i;var l="0123456789abcdef".split("");function p(e){for(var t="",i=0;i<4;i++)t+=l[e>>8*i+4&15]+l[e>>8*i&15];return t}function d(e){return function(e){for(var t=0;t<e.length;t++)e[t]=p(e[t]);return e.join("")}(function(e){var t,n=e.length,r=[1732584193,-271733879,-1732584194,271733878];for(t=64;t<=e.length;t+=64)i(r,c(e.substring(t-64,t)));e=e.substring(t-64);var s=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;t<e.length;t++)s[t>>2]|=e.charCodeAt(t)<<(t%4<<3);if(s[t>>2]|=128<<(t%4<<3),t>55)for(i(r,s),t=0;t<16;t++)s[t]=0;return s[14]=8*n,i(r,s),r}(e))}function u(e,t){return e+t&4294967295}t.md5=d,d("hello")},128:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getKeys=t.isDefined=t.isObject=t.get=t.isEmpty=t.WAL=t.unpatchText=t.getTextPatch=t.stableStringify=t.omitKeys=t.pickKeys=t.asName=void 0;const n=i(899);function r(e,t=[],i=!1){let n=t;if(!n.length)return{};if(e&&n.length){let t={};return n.forEach((n=>{i&&void 0===e[n]||(t[n]=e[n])})),t}return e}function s(e){for(var t in e)return!1;return!0}function o(e){return Object.keys(e)}t.asName=function(e){if(null==e||!e.toString||!e.toString())throw"Expecting a non empty string";return`"${e.toString().replace(/"/g,'""')}"`},t.pickKeys=r,t.omitKeys=function(e,t){return r(e,o(e).filter((e=>!t.includes(e))))},t.stableStringify=function(e,t){t||(t={}),"function"==typeof t&&(t={cmp:t});var i,n="boolean"==typeof t.cycles&&t.cycles,r=t.cmp&&(i=t.cmp,function(e){return function(t,n){var r={key:t,value:e[t]},s={key:n,value:e[n]};return i(r,s)}}),s=[];return function e(t){if(t&&t.toJSON&&"function"==typeof t.toJSON&&(t=t.toJSON()),void 0!==t){if("number"==typeof t)return isFinite(t)?""+t:"null";if("object"!=typeof t)return JSON.stringify(t);var i,o;if(Array.isArray(t)){for(o="[",i=0;i<t.length;i++)i&&(o+=","),o+=e(t[i])||"null";return o+"]"}if(null===t)return"null";if(-1!==s.indexOf(t)){if(n)return JSON.stringify("__cycle__");throw new TypeError("Converting circular structure to JSON")}var a=s.push(t)-1,c=Object.keys(t).sort(r&&r(t));for(o="",i=0;i<c.length;i++){var l=c[i],p=e(t[l]);p&&(o&&(o+=","),o+=JSON.stringify(l)+":"+p)}return s.splice(a,1),"{"+o+"}"}}(e)},t.getTextPatch=function(e,t){if(!(e&&t&&e.trim().length&&t.trim().length))return t;if(e===t)return{from:0,to:0,text:"",md5:(0,n.md5)(t)};function i(i=1){let n=i<1?-1:0,r=!1;for(;!r&&Math.abs(n)<=t.length;){const s=i<1?[n]:[0,n];e.slice(...s)!==t.slice(...s)?r=!0:n+=1*Math.sign(i)}return n}let r=i()-1,s=e.length+i(-1)+1,o=t.length+i(-1)+1;return{from:r,to:s,text:t.slice(r,o),md5:(0,n.md5)(t)}},t.unpatchText=function(e,t){if(!t||"string"==typeof t)return t;const{from:i,to:r,text:s,md5:o}=t;if(null===s||null===e)return s;let a=e.slice(0,i)+s+e.slice(r);if(o&&(0,n.md5)(a)!==o)throw"Patch text error: Could not match md5 hash: (original/result) \n"+e+"\n"+a;return a},t.WAL=class{constructor(e){if(this.changed={},this.sending={},this.sentHistory={},this.callbacks=[],this.sort=(e,t)=>{const{orderBy:i}=this.options;return i&&e&&t&&i.map((i=>{if(!(i.fieldName in e)||!(i.fieldName in t))throw"Replication error: \n   some orderBy fields missing from data";let n=i.asc?e[i.fieldName]:t[i.fieldName],r=i.asc?t[i.fieldName]:e[i.fieldName],s=+n-+r,o=n<r?-1:n==r?0:1;return"number"===i.tsDataType&&Number.isFinite(s)?s:o})).find((e=>e))||0},this.isInHistory=e=>{if(!e)throw"Provide item";const t=e[this.options.synced_field];if(!Number.isFinite(+t))throw"Provided item Synced field value is missing/invalid ";const i=this.sentHistory[this.getIdStr(e)],n=i?.[this.options.synced_field];if(i){if(!Number.isFinite(+n))throw"Provided historic item Synced field value is missing/invalid";if(+n==+t)return!0}return!1},this.addData=e=>{s(this.changed)&&this.options.onSendStart&&this.options.onSendStart(),e.map((e=>{var t;const{initial:i,current:n,delta:r}={...e};if(!n)throw"Expecting { current: object, initial?: object }";const s=this.getIdStr(n);this.changed??(this.changed={}),(t=this.changed)[s]??(t[s]={initial:i,current:n,delta:r}),this.changed[s].current={...this.changed[s].current,...n},this.changed[s].delta={...this.changed[s].delta,...r}})),this.sendItems()},this.isOnSending=!1,this.isSendingTimeout=void 0,this.willDeleteHistory=void 0,this.sendItems=async()=>{const{DEBUG_MODE:e,onSend:t,onSendEnd:i,batch_size:n,throttle:r,historyAgeSeconds:o=2}=this.options;if(this.isSendingTimeout||this.sending&&!s(this.sending))return;if(!this.changed||s(this.changed))return;let a,c=[],l=[],p={};Object.keys(this.changed).sort(((e,t)=>this.sort(this.changed[e].current,this.changed[t].current))).slice(0,n).map((e=>{let t={...this.changed[e]};this.sending[e]={...t},l.push({...t}),p[e]={...t.current},delete this.changed[e]})),c=l.map((e=>{let t={};return Object.keys(e.current).map((i=>{const n=e.initial?.[i],r=e.current[i];var s,o;![this.options.synced_field,...this.options.id_fields].includes(i)&&((s=n)===(o=r)||(["number","string","boolean"].includes(typeof s)?s===o:JSON.stringify(s)===JSON.stringify(o)))||(t[i]=r)})),t})),e&&console.log(this.options.id," SENDING lr->",c[c.length-1]),this.isSendingTimeout||(this.isSendingTimeout=setTimeout((()=>{this.isSendingTimeout=void 0,s(this.changed)||this.sendItems()}),r)),this.isOnSending=!0;try{await t(c,l),o&&(this.sentHistory={...this.sentHistory,...p},this.willDeleteHistory||(this.willDeleteHistory=setTimeout((()=>{this.willDeleteHistory=void 0,this.sentHistory={}}),1e3*o)))}catch(e){a=e,console.error("WAL onSend failed:",e,c,l)}if(this.isOnSending=!1,this.callbacks.length){const e=Object.keys(this.sending);this.callbacks.forEach(((t,i)=>{t.idStrs=t.idStrs.filter((t=>e.includes(t))),t.idStrs.length||t.cb(a)})),this.callbacks=this.callbacks.filter((e=>e.idStrs.length))}this.sending={},e&&console.log(this.options.id," SENT lr->",c[c.length-1]),s(this.changed)?i&&i(c,l,a):this.sendItems()},this.options={...e},!this.options.orderBy){const{synced_field:t,id_fields:i}=e;this.options.orderBy=[t,...i.sort()].map((e=>({fieldName:e,tsDataType:e===t?"number":"string",asc:!0})))}}isSending(){const e=this.isOnSending||!(s(this.sending)&&s(this.changed));return this.options.DEBUG_MODE&&console.log(this.options.id," CHECKING isSending ->",e),e}getIdStr(e){return this.options.id_fields.sort().map((t=>`${e[t]||""}`)).join(".")}getIdObj(e){let t={};return this.options.id_fields.sort().map((i=>{t[i]=e[i]})),t}getDeltaObj(e){let t={};return Object.keys(e).map((i=>{this.options.id_fields.includes(i)||(t[i]=e[i])})),t}},t.isEmpty=s,t.get=function(e,t){let i=t,n=e;return e?("string"==typeof i&&(i=i.split(".")),i.reduce(((e,t)=>e&&e[t]?e[t]:void 0),n)):e},t.isObject=function(e){return Boolean(e&&"object"==typeof e&&!Array.isArray(e))},t.isDefined=function(e){return null!=e},t.getKeys=o}},t={};return function i(n){var r=t[n];if(void 0!==r)return r.exports;var s=t[n]={exports:{}};return e[n].call(s.exports,s,s.exports,i),s.exports}(590)})()));