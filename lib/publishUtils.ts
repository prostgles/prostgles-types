export type ClientSchemaDefinition = {
  userType: string;
  schema: unknown;
};

export type ClientSchemaDefinitions = readonly ClientSchemaDefinition[];

export type DefaultClientSchemas = readonly [{ userType: string; schema: void }];

export type ClientUserType<Schemas extends ClientSchemaDefinitions> = Schemas[number]["userType"];

export type ClientSchemaFor<
  Schemas extends ClientSchemaDefinitions,
  UserType extends ClientUserType<Schemas>,
  Entry = Schemas[number],
> =
  Entry extends ClientSchemaDefinition ?
    UserType extends Entry["userType"] ?
      Entry["schema"]
    : never
  : never;
