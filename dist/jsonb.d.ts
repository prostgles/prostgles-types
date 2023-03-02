import { StrictUnion } from "./util";
import type { JSONSchema7 } from "json-schema";
export declare const PrimitiveTypes: readonly ["boolean", "number", "integer", "string", "any"];
export declare const PrimitiveArrayTypes: ("string[]" | "number[]" | "boolean[]" | "integer[]" | "any[]")[];
export declare const DATA_TYPES: readonly ["boolean", "number", "integer", "string", "any", ...("string[]" | "number[]" | "boolean[]" | "integer[]" | "any[]")[]];
type DataType = typeof DATA_TYPES[number];
export declare namespace JSONB {
    export type BaseOptions = {
        optional?: boolean;
        nullable?: boolean;
        description?: string;
        title?: string;
    };
    export type BasicType = BaseOptions & {
        type: DataType;
        allowedValues?: any[];
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
        };
    };
    export type FieldTypeObj = StrictUnion<BasicType | ObjectType | EnumType | OneOf | ArrayOf | RecordType>;
    export type FieldType = DataType | FieldTypeObj;
    export type GetType<T extends FieldType | Omit<FieldTypeObj, "optional">> = GetWNullType<T extends DataType ? {
        type: T;
    } : T>;
    type GetWNullType<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">> = T extends {
        nullable: true;
    } ? (null | _GetType<T>) : _GetType<T>;
    type _GetType<T extends FieldTypeObj | Omit<FieldTypeObj, "optional">> = T extends {
        type: ObjectSchema;
    } ? GetObjectType<T["type"]> : T extends {
        type: "number";
    } ? number : T extends {
        type: "boolean";
    } ? boolean : T extends {
        type: "integer";
    } ? number : T extends {
        type: "string";
    } ? string : T extends {
        type: "any";
    } ? any : T extends {
        type: "number[]";
    } ? number[] : T extends {
        type: "boolean[]";
    } ? boolean[] : T extends {
        type: "integer[]";
    } ? number[] : T extends {
        type: "string[]";
    } ? string[] : T extends {
        type: "any[]";
    } ? any[] : T extends {
        "enum": readonly any[] | any[];
    } ? T["enum"][number] : T extends {
        "record": RecordType["record"];
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
    export type JSONBSchema = Omit<FieldTypeObj, "optional">;
    export type GetObjectType<S extends ObjectSchema> = ({
        [K in keyof S as IsOptional<S[K]> extends true ? K : never]?: GetType<S[K]>;
    } & {
        [K in keyof S as IsOptional<S[K]> extends true ? never : K]: GetType<S[K]>;
    });
    export type GetSchemaType<S extends JSONBSchema> = S["nullable"] extends true ? (null | GetType<S>) : GetType<S>;
    export {};
}
export declare function getJSONBSchemaAsJSONSchema(tableName: string, colName: string, schema: JSONB.JSONBSchema): JSONSchema7;
export {};
//# sourceMappingURL=jsonb.d.ts.map