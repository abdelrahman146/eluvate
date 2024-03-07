import { IModel } from "../../lib/types/model";

const model: IModel = {
  name: "project",
  db_name: "project",
  fields: [
    {
      name: "id",
      type: "int",
      primaryKey: true,
      nullable: false,
      auto: "increment",
    },
    {
      name: "project_name",
      type: "string",
      size: 50,
      primaryKey: false,
      unique: true,
      nullable: false,
      defaultValue: "new project",
    },
  ],
  relations: [
    {
      name: "client",
      type: "belongs-to",
      nullable: false,
      model: "client",
      references: "id",
      referencesType: "int",
    },
    {
      name: "invoices",
      type: "has-many",
      primaryKey: false,
      model: "invoice",
      references: "id",
      referencesType: "int",
    },
  ],
};

export default model;
