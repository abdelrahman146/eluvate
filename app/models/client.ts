import { IModel } from "../../lib/types/model";
import project from "./project";

const client: IModel = {
  name: "client",
  db_name: "client",
  fields: [
    {
      name: "id",
      type: "int",
      primaryKey: true,
      nullable: false,
      auto: "increment",
    },
    {
      name: "client_name",
      type: "string",
      size: 50,
      primaryKey: false,
      unique: true,
      nullable: false,
    },
    {
      name: "contact_info",
      type: "string",
      size: 100,
      nullable: true,
      defaultValue: "Not provided",
    },
  ],
  relations: [
    {
      name: "projects",
      model: "project",
      type: "has-many",
      references: "id",
      referencesType: "int",
    },
  ],
};

export default client;
