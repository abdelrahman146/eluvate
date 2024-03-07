export type IFieldType =
  | "string"
  | "int"
  | "uuid"
  | "boolean"
  | "float"
  | "text"
  | "bigint"
  | "bytes"
  | "decimal"
  | "date-time"
  | "date";
export interface IField {
  name: string;
  type: IFieldType;
  primaryKey?: boolean;
  unique?: boolean;
  nullable?: boolean;
  auto?: "increment" | "uuid" | "cuid" | "now";
  size?: number;
  defaultValue?: string;
}

export type IRelationType = "has-one" | "has-many" | "belongs-to";
export interface IRelation {
  name: string;
  model: string;
  type: IRelationType;
  nullable?: boolean;
  primaryKey?: boolean;
  unique?: boolean;
  references: string;
  referencesType: IFieldType;
}

export interface IModel {
  name: string;
  db_name?: string;
  fields: IField[];
  relations: IRelation[];
}
