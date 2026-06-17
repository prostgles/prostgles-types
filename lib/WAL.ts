import { isEmpty, isEqual, type AnyObject, type TS_COLUMN_DATA_TYPES } from "./index";

/* Replication */
export type SyncTableInfo = {
  id_fields: string[];
  synced_field: string;
  throttle: number;
  batch_size: number;
};

export type BasicOrderBy = {
  fieldName: string;
  /**
   * Used to ensure numbers are not left as strings in some cases
   */
  tsDataType: TS_COLUMN_DATA_TYPES;
  asc: boolean;
}[];

export type WALConfig = SyncTableInfo & {
  /**
   * Fired when new data is added and there is no sending in progress
   */
  onSendStart?: () => any;
  /**
   * Fired on each data send batch
   */
  onSend: (items: AnyObject[], fullItems: WALItem[]) => Promise<any>;
  /**
   * Fired after all data was sent or when a batch error is thrown
   */
  onSendEnd?: (batch: AnyObject[], fullItems: WALItem[], error?: unknown) => any;

  /**
   * Order by which the items will be synced. Defaults to [synced_field, ...id_fields.sort()]
   */
  orderBy?: BasicOrderBy;

  /**
   * Defaults to 2 seconds
   */
  historyAgeSeconds?: number;

  DEBUG_MODE?: boolean;

  id?: string;
};
export type WALItem = {
  initial?: AnyObject;
  delta?: AnyObject;
  current: AnyObject;
};
export type WALItemsObj = Record<string, WALItem>;

/**
 * Used to throttle and combine updates sent to server
 * This allows a high rate of optimistic updates on the client
 */
export class WAL {
  /**
   * Instantly merged records for prepared for update
   */
  private changed: WALItemsObj = {};

  /**
   * Batch of records (removed from this.changed) that are currently being sent
   */
  private sending: WALItemsObj = {};

  /**
   * Historic data used to reduce data pushes from server to client
   */
  private sentHistory: Record<string, AnyObject> = {};

  private options: WALConfig;
  private callbacks: { cb: Function; idStrs: string[] }[] = [];

  constructor(args: WALConfig) {
    this.options = { ...args };
    if (!this.options.orderBy) {
      const { synced_field, id_fields } = args;
      this.options.orderBy = [synced_field, ...id_fields.sort()].map((fieldName) => ({
        fieldName,
        tsDataType: fieldName === synced_field ? "number" : "string",
        asc: true,
      }));
    }
  }

  sort = (a?: AnyObject, b?: AnyObject): number => {
    const { orderBy } = this.options;
    if (!orderBy || !a || !b) return 0;

    return (
      orderBy
        .map((ob) => {
          /* TODO: add fullData to changed items + ensure orderBy is in select */
          if (!(ob.fieldName in a) || !(ob.fieldName in b)) {
            throw `Replication error: \n   some orderBy fields missing from data`;
          }
          let v1 = ob.asc ? a[ob.fieldName] : b[ob.fieldName],
            v2 = ob.asc ? b[ob.fieldName] : a[ob.fieldName];

          let vNum = +v1 - +v2,
            vStr =
              v1 < v2 ? -1
              : v1 == v2 ? 0
              : 1;
          return ob.tsDataType === "number" && Number.isFinite(vNum) ? vNum : vStr;
        })
        .find((v) => v) || 0
    );
  };

  isSending(): boolean {
    const result = this.isOnSending || !(isEmpty(this.sending) && isEmpty(this.changed));
    if (this.options.DEBUG_MODE) {
      console.log(this.options.id, " CHECKING isSending ->", result);
    }
    return result;
  }

  /**
   * Used by server to avoid unnecessary data push to client.
   * This can happen due to the same data item having been previously pushed by the client
   */
  isInHistory = (item: AnyObject): boolean => {
    if (!item) throw "Provide item";
    const itemSyncVal = item[this.options.synced_field];
    if (!Number.isFinite(+itemSyncVal))
      throw "Provided item Synced field value is missing/invalid ";

    const existing = this.sentHistory[this.getIdStr(item)];
    const existingSyncVal = existing?.[this.options.synced_field];
    if (existing) {
      if (!Number.isFinite(+existingSyncVal))
        throw "Provided historic item Synced field value is missing/invalid";
      if (+existingSyncVal === +itemSyncVal) {
        return true;
      }
    }
    return false;
  };

  getIdStr(d: AnyObject): string {
    return this.options.id_fields
      .sort()
      .map((key) => String(d[key]))
      .join(".");
  }
  getIdObj(d: AnyObject): AnyObject {
    let res: AnyObject = {};
    this.options.id_fields.sort().map((key) => {
      res[key] = d[key];
    });
    return res;
  }
  getDeltaObj(d: AnyObject): AnyObject {
    let res: AnyObject = {};
    Object.keys(d).map((key) => {
      if (!this.options.id_fields.includes(key)) {
        res[key] = d[key];
      }
    });
    return res;
  }

  addData = (data: WALItem[]) => {
    if (isEmpty(this.changed) && this.options.onSendStart) this.options.onSendStart();

    data.forEach((d) => {
      const { initial, current, delta } = { ...d };
      if (!current) throw "Expecting { current: object, initial?: object }";
      const idStr = this.getIdStr(current);

      this.changed ??= {};
      this.changed[idStr] ??= { initial, current, delta };
      this.changed[idStr]!.current = {
        ...this.changed[idStr]!.current,
        ...current,
      };
      this.changed[idStr]!.delta = {
        ...this.changed[idStr]!.delta,
        ...delta,
      };
    });
    return this.sendItems();
  };

  isOnSending = false;
  isSendingTimeout?: ReturnType<typeof setTimeout> = undefined;
  willDeleteHistory?: ReturnType<typeof setTimeout> = undefined;
  private sendItems = async () => {
    const {
      DEBUG_MODE,
      onSend,
      onSendEnd,
      batch_size,
      throttle,
      historyAgeSeconds = 2,
    } = this.options;

    // Sending data. stop here
    if (this.isSendingTimeout || (this.sending && !isEmpty(this.sending))) return;

    // Nothing to send. stop here
    if (!this.changed || isEmpty(this.changed)) return;

    // Prepare batch to send
    let batchItems: AnyObject[] = [],
      walBatch: WALItem[] = [],
      batchObj: Record<string, AnyObject> = {};

    /**
     * Prepare and remove a batch from this.changed
     */
    Object.keys(this.changed)
      .sort((a, b) => this.sort(this.changed[a]!.current, this.changed[b]!.current))
      .slice(0, batch_size)
      .map((key) => {
        let item = { ...this.changed[key] } as WALItem;
        this.sending[key] = { ...item };
        walBatch.push({ ...item });

        /* Used for history */
        batchObj[key] = { ...item.current };

        delete this.changed[key];
      });
    batchItems = walBatch.map((d) => {
      let result: AnyObject = {};
      Object.keys(d.current).map((k) => {
        const oldVal = d.initial?.[k];
        const newVal = d.current[k];
        /** Send only id fields and delta */
        if (
          [this.options.synced_field, ...this.options.id_fields].includes(k) ||
          !isEqual(oldVal, newVal)
        ) {
          result[k] = newVal;
        }
      });
      return result;
    });

    if (DEBUG_MODE) {
      console.log(this.options.id, " SENDING lr->", batchItems[batchItems.length - 1]);
    }

    // Throttle next data send
    if (!this.isSendingTimeout) {
      this.isSendingTimeout = setTimeout(() => {
        this.isSendingTimeout = undefined;
        if (!isEmpty(this.changed)) {
          this.sendItems();
        }
      }, throttle);
    }

    let error: any;
    this.isOnSending = true;
    try {
      /* Deleted data should be sent normally through await db.table.delete(...) */
      await onSend(batchItems, walBatch); //, deletedData);

      /**
       * Keep history if required
       */
      if (historyAgeSeconds) {
        this.sentHistory = {
          ...this.sentHistory,
          ...batchObj,
        };
        /**
         * Delete history after some time
         */
        if (!this.willDeleteHistory) {
          this.willDeleteHistory = setTimeout(() => {
            this.willDeleteHistory = undefined;
            this.sentHistory = {};
          }, historyAgeSeconds * 1000);
        }
      }
    } catch (err) {
      error = err;
      console.error("WAL onSend failed:", err, batchItems, walBatch);
    }
    this.isOnSending = false;

    /* Fire any callbacks */
    if (this.callbacks.length) {
      const ids = Object.keys(this.sending);
      this.callbacks.forEach((c, i) => {
        c.idStrs = c.idStrs.filter((id) => ids.includes(id));
        if (!c.idStrs.length) {
          c.cb(error);
        }
      });
      this.callbacks = this.callbacks.filter((cb) => cb.idStrs.length);
    }

    this.sending = {};
    if (DEBUG_MODE) {
      console.log(this.options.id, " SENT lr->", batchItems[batchItems.length - 1]);
    }
    if (!isEmpty(this.changed)) {
      this.sendItems();
    } else {
      if (onSendEnd) onSendEnd(batchItems, walBatch, error);
    }
  };
}
