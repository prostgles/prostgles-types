type ColumnNull<T> = 0 extends 1 & T
  ? null | undefined
  : Extract<T, null | undefined>;
type DateTruncFunctionName = "$date_trunc";

type StringFunctionName =
  | "$md5_multi"
  | "$md5_multi_agg"
  | "$sha256_multi"
  | "$sha256_multi_agg"
  | "$sha512_multi"
  | "$sha512_multi_agg"
  | "$ts_headline"
  | "$ts_headline_simple"
  | "$ts_headline_english"
  | "$jsonb_each_text"
  | "$jsonb_object_keys"
  | "$jsonb_pretty"
  | "$jsonb_array_elements_text"
  | "$jsonb_typeof"
  | "$ST_AsText"
  | "$ST_AsEWKT"
  | "$ST_AsMVTGeom"
  | "$st_aslatlontext"
  | "$ST_Extent"
  | "$ST_3DExtent"
  | "$left"
  | "$unnest_words"
  | "$right"
  | "$to_char"
  | "$template_string"
  | "$date"
  | "$datetime"
  | "$day"
  | "$upper"
  | "$lower"
  | "$reverse"
  | "$trim"
  | "$initcap"
  | "$md5"
  | "$crypt"
  | "$string_agg";

type NumberFunctionName =
  | "$jsonb_array_length"
  | "$<->"
  | "$ST_Distance"
  | "$ST_DistanceSpheroid"
  | "$ST_DistanceSphere"
  | "$ST_XMin_Agg"
  | "$ST_XMax_Agg"
  | "$ST_YMin_Agg"
  | "$ST_YMax_Agg"
  | "$ST_ZMin_Agg"
  | "$ST_ZMax_Agg"
  | "$ST_Length"
  | "$ST_X"
  | "$ST_Y"
  | "$ST_Z"
  | "$date_part"
  | "$length"
  | "$round"
  | "$ceil"
  | "$floor"
  | "$sign"
  | "$position"
  | "$position_lower";

type JsonFunctionName =
  | "$jsonb_path_query"
  | "$jsonb_each"
  | "$jsonb_to_record"
  | "$jsonb_array_elements"
  | "$ST_AsGeoJSON"
  | "$ST_Simplify"
  | "$ST_SnapToGrid"
  | "$ST_Centroid"
  | "$jsonb_build_object";

export type FunctionName =
  | StringFunctionName
  | DateTruncFunctionName
  | NumberFunctionName
  | JsonFunctionName
  | "$avg"
  | "$sum"
  | "$count"
  | "$countAll"
  | "$diff_perc"
  | "$ST_DWithin"
  | "$ST_AsEWKB"
  | "$ST_AsBinary"
  | "$ST_AsMVT"
  | "$age"
  | "$ageNow"
  | "$difference"
  | "$term_highlight"
  | "$column"
  | "$max"
  | "$min"
  | "$jsonb_set"
  | "$jsonb_strip_nulls"
  | "$array_agg"
  | "$json_agg"
  | "$jsonb_agg";

export type FunctionReturnTypes<ColumnType = any> = {
  [Name in FunctionName]: Name extends StringFunctionName | DateTruncFunctionName ?
    string | ColumnNull<ColumnType>
  : Name extends NumberFunctionName ? number | ColumnNull<ColumnType>
  : Name extends "$avg" | "$sum" ? number | string | ColumnNull<ColumnType>
  : Name extends "$count" | "$countAll" | "$diff_perc" ? string
  : Name extends "$ST_DWithin" ? boolean | ColumnNull<ColumnType>
  : Name extends "$ST_AsEWKB" | "$ST_AsBinary" | "$ST_AsMVT" ? Uint8Array | ColumnNull<ColumnType>
  : Name extends JsonFunctionName ? Record<string, unknown> | ColumnNull<ColumnType>
  : Name extends "$column" | "$max" | "$min" | "$jsonb_set" | "$jsonb_strip_nulls" ? ColumnType
  : Name extends "$array_agg" | "$json_agg" | "$jsonb_agg" ? ColumnType[]
  : any;
};

type SelectedFunctionName<F> = F extends FunctionName ? F : Extract<keyof F, FunctionName>;
type SelectedFunctionArgs<F> = F[Extract<keyof F, FunctionName>];
type SelectedColumnType<F, TD, SelectedKey> =
  F extends FunctionName ?
    SelectedKey extends keyof TD ?
      TD[SelectedKey]
    : any
  : SelectedFunctionArgs<F> extends readonly [infer ColumnName, ...any[]] ?
    ColumnName extends keyof TD ?
      TD[ColumnName]
    : any
  : any;

export type GetFunctionReturnType<F, TD, SelectedKey> = FunctionReturnTypes<
  SelectedColumnType<F, TD, SelectedKey>
>[SelectedFunctionName<F>];
