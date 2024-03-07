import { IModel } from "../../lib/types/model";

const invoice: IModel = {
  name: "invoice",
  fields: [
    {
      name: "id",
      type: "int",
      primaryKey: true,
      nullable: false,
      auto: "increment",
    },
    {
      name: "invoice_number",
      type: "string",
      size: 50,
      primaryKey: false,
      unique: true,
      nullable: false,
    },
    {
      name: "amount_due",
      type: "float",
      nullable: false,
      defaultValue: "0",
    },
  ],
  relations: [
    {
      name: "project",
      type: "belongs-to",
      nullable: false,
      model: "project",
      references: "id",
      referencesType: "int",
    },
  ],
};

export default invoice;
