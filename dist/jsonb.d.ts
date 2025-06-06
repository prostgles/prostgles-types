import type { JSONSchema7 } from "json-schema";
import { AnyObject } from "./filters";
import { StrictUnion } from "./util";
export declare const PrimitiveTypes: readonly ["boolean", "number", "integer", "string", "Date", "time", "timestamp", "any"];
export declare const PrimitiveArrayTypes: ("number[]" | "boolean[]" | "string[]" | "any[]" | "time[]" | "timestamp[]" | "integer[]" | "Date[]")[];
export declare const DATA_TYPES: readonly ["boolean", "number", "integer", "string", "Date", "time", "timestamp", "any", ...("number[]" | "boolean[]" | "string[]" | "any[]" | "time[]" | "timestamp[]" | "integer[]" | "Date[]")[]];
type DataType = (typeof DATA_TYPES)[number];
export declare namespace JSONB {
    export type BaseOptions = {
        /**
         * False by default
         */
        optional?: boolean;
        /**
         * False by default
         */
        nullable?: boolean;
        description?: string;
        title?: string;
    };
    export type Lookup = BaseOptions & {
        type?: "Lookup" | "Lookup[]";
        lookup: {
            type: "data"
            /**
             * This is used as edit-mode (to generate lookup of type data)
             */
             | "data-def";
            table: string;
            column: string;
            filter?: AnyObject;
            isArray?: boolean;
            isFullRow?: {
                /**
                 * Columns used to display the selected row in the dropdown
                 */
                displayColumns?: string[];
            };
            /**
             * Columns used to search
             */
            searchColumns?: string[];
            /**
             * If true then a button will be shown
             *  in the row card footer to access this action
             */
            showInRowCard?: {
                /**
                 * Action button text. Defaults to the method name
                 */
                actionLabel?: string;
                actionColor?: "danger" | "warn" | "action";
                actionStyle?: AnyObject;
                actionClass?: string;
            };
        } | {
            type: "schema";
            isArray?: boolean;
            object: "column" | "table";
            filter?: {
                table?: string;
                tsDataType?: string;
                udt_name?: string;
            };
        };
        allowedValues?: undefined;
        oneOf?: undefined;
        oneOfType?: undefined;
        arrayOf?: undefined;
        arrayOfType?: undefined;
        enum?: undefined;
    };
    export type BasicType = BaseOptions & {
        type: DataType;
        allowedValues?: readonly any[] | any[];
        oneOf?: undefined;
        oneOfType?: undefined;
        arrayOf?: undefined;
        arrayOfType?: undefined;
        enum?: undefined;
    };
    export type ObjectType = BaseOptions & {
        type: ObjectSchema;
        allowedValues?: undefined;
        oneOf?: undefined;
        oneOfType?: undefined;
        arrayOf?: undefined;
        arrayOfType?: undefined;
        enum?: undefined;
    };
    export type EnumType = BaseOptions & {
        type?: undefined;
        enum: readonly any[];
        oneOf?: undefined;
        oneOfType?: undefined;
        arrayOf?: undefined;
        arrayOfType?: undefined;
        allowedValues?: undefined;
    };
    export type OneOf = BaseOptions & {
        type?: undefined;
        arrayOf?: undefined;
        arrayOfType?: undefined;
        allowedValues?: undefined;
        enum?: undefined;
    } & ({
        oneOf?: undefined;
        oneOfType: readonly ObjectSchema[];
    } | {
        oneOf: FieldType[];
        oneOfType?: undefined;
    });
    export type ArrayOf = BaseOptions & {
        type?: undefined;
        allowedValues?: undefined;
        oneOf?: undefined;
        oneOfType?: undefined;
        enum?: undefined;
    } & ({
        arrayOf?: undefined;
        arrayOfType: ObjectSchema;
    } | {
        arrayOf: FieldType;
        arrayOfType?: undefined;
    });
    export type RecordType = BaseOptions & {
        type?: undefined;
        allowedValues?: undefined;
        oneOf?: undefined;
        oneOfType?: undefined;
        arrayOf?: undefined;
        arrayOfType?: undefined;
        enum?: undefined;
        record: {
            keysEnum?: readonly string[];
            values?: FieldType;
            partial?: boolean;
        };
    };
    export type FieldTypeObj = StrictUnion<BasicType | ObjectType | EnumType | OneOf | ArrayOf | RecordType | Lookup>;
    export type FieldType = DataType | FieldTypeObj;
    export type GetType<T extends FieldType | Omit<FieldTypeObj, "optional">> = GetWNullType<T extends DataType ? {
        type: T;
    } : T>;
    type GetWNullType<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">> = T extends {
        nullable: true;
    } ? null | _GetType<T> : _GetType<T>;
    type GetAllowedValues<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">, TType> = T extends {
        allowedValues: readonly any[];
    } ? T["allowedValues"][number] : TType;
    type _GetType<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">> = T extends {
        type: ObjectSchema;
    } ? GetObjectType<T["type"]> : T extends {
        type: "number";
    } ? GetAllowedValues<T, number> : T extends {
        type: "boolean";
    } ? GetAllowedValues<T, boolean> : T extends {
        type: "integer";
    } ? GetAllowedValues<T, number> : T extends {
        type: "string";
    } ? GetAllowedValues<T, string> : T extends {
        type: "time";
    } ? GetAllowedValues<T, string> : T extends {
        type: "timestamp";
    } ? GetAllowedValues<T, string> : T extends {
        type: "Date";
    } ? GetAllowedValues<T, string> : T extends {
        type: "any";
    } ? GetAllowedValues<T, any> : T extends {
        type: "number[]";
    } ? GetAllowedValues<T, number>[] : T extends {
        type: "boolean[]";
    } ? GetAllowedValues<T, boolean>[] : T extends {
        type: "integer[]";
    } ? GetAllowedValues<T, number>[] : T extends {
        type: "time[]";
    } ? GetAllowedValues<T, string>[] : T extends {
        type: "timestamp[]";
    } ? GetAllowedValues<T, string>[] : T extends {
        type: "Date[]";
    } ? GetAllowedValues<T, string>[] : T extends {
        type: "string[]";
    } ? GetAllowedValues<T, string>[] : T extends {
        type: "any[]";
    } ? GetAllowedValues<T, any>[] : T extends {
        enum: readonly any[] | any[];
    } ? T["enum"][number] : T extends {
        record: RecordType["record"];
    } ? Record<T["record"] extends {
        keysEnum: readonly string[];
    } ? T["record"]["keysEnum"][number] : string, T["record"] extends {
        values: FieldType;
    } ? GetType<T["record"]["values"]> : any> : T extends {
        oneOf: readonly FieldType[] | FieldType[];
    } ? GetType<T["oneOf"][number]> : T extends {
        oneOfType: readonly ObjectSchema[] | ObjectSchema[];
    } ? GetObjectType<T["oneOfType"][number]> : T extends {
        arrayOf: FieldType;
    } ? GetType<T["arrayOf"]>[] : T extends {
        arrayOfType: ObjectSchema;
    } ? GetObjectType<T["arrayOfType"]>[] : any;
    type IsOptional<F extends FieldType> = F extends DataType ? false : F extends {
        optional: true;
    } ? true : false;
    type ObjectSchema = Record<string, FieldType>;
    export type JSONBSchema<T extends FieldTypeObj = FieldTypeObj> = Omit<T, "optional"> & {
        defaultValue?: any;
    };
    export type GetObjectType<S extends ObjectSchema> = {
        [K in keyof S as IsOptional<S[K]> extends true ? K : never]?: GetType<S[K]>;
    } & {
        [K in keyof S as IsOptional<S[K]> extends true ? never : K]: GetType<S[K]>;
    };
    export type GetSchemaType<S extends JSONBSchema> = S["nullable"] extends true ? null | GetType<S> : GetType<S>;
    export {};
}
export declare const getJSONSchemaObject: (rawType: JSONB.FieldType | JSONB.JSONBSchema, rootInfo?: {
    id: string;
}) => JSONSchema7;
export declare function getJSONBSchemaAsJSONSchema(tableName: string, colName: string, schema: JSONB.JSONBSchema): JSONSchema7;
export {};
//# sourceMappingURL=jsonb.d.ts.map