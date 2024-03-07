// generatePrismaSchema.ts

import * as fs from "fs";
import * as path from "path";
import { IField, IFieldType, IModel, IRelation } from "../types/model";
import { capitalizeFirstLetter } from "../utils/string.utils";
import { getAppConfig } from "../utils/fs.utils";
import { IDatabaseConfig } from "../types/app.config";
import { readModelFiles } from "../utils/models.utils";

const default_rows = `
  deleted            Boolean?  @default(false)
  created_at         DateTime  @default(now())
  updated_at         DateTime  @updatedAt
`;

const generateDefinedModels = (models: IModel[]) => `
enum AuthProvider {
  LOCAL
  GOOGLE
}

model user {
  id                 Int             @id @default(autoincrement())
  email              String          @unique
  email_verified     Boolean         @default(false)
  password           String
  provider           AuthProvider    @default(LOCAL)
  first_name         String
  last_name          String
  avatar_url         String?
  forgot_password_id String?
  role               role            @relation(fields: [roleId], references: [id])
  roleId             String
  history            history[]
  ${default_rows}
}

model role {
  id             String  @id
  name           String
  ${models
    .map(
      model => `
  create_${model.name}  Boolean @default(true)
  read_${model.name}    Boolean @default(true)
  update_${model.name}  Boolean @default(true)
  delete_${model.name}  Boolean @default(true)
  `,
    )
    .join("\n")}
  user           user[]
  ${default_rows}
}

model history {
  id          BigInt @id @default(autoincrement())
  activity    String
  user        user   @relation(fields: [userId], references: [id])
  userId      Int
  entity      String
  rowId       Int
  created_at  DateTime  @default(now())
}
`;

function getDatabaseUrl(databaseConfig: IDatabaseConfig) {
  const { provider, host, port, dbname, dbpassword, dbuser } = databaseConfig;
  switch (provider) {
    case "postgres":
      return `postgres://${dbuser}:${dbpassword}@${host}:${port}/${dbname}`;
    case "sqlite":
      return `file:./${dbname}.db`;
    default:
      return ``;
  }
}

function generateDataSource() {
  const appConfig = getAppConfig();
  return `
  datasource db {
    provider = "${appConfig.database.provider}"
    url      = "${getDatabaseUrl(appConfig.database)}"
  }
  
  generator client {
    provider = "prisma-client-js"
  }
  \n
  `;
}

function mapDefaultValue(field: IField) {
  if (field.auto) {
    return field.auto === "increment" ? "autoincrement" : field.auto + "()";
  }
  if (["string", "text"].includes(field.type)) {
    return `"${field.defaultValue}"`;
  }
  return field.defaultValue;
}

function mapFieldType(type: IFieldType) {
  switch (type) {
    case "boolean":
      return "Boolean";
    case "float":
      return "Float";
    case "int":
      return "Int";
    case "string":
      return "String";
    case "text":
      return "Text";
    case "date-time":
      return "DateTime";
    case "bigint":
      return "BigInt";
    case "bytes":
      return "Bytes";
    case "decimal":
      return "Decimal";
  }
}

function generatePrismaField(field: IField): string {
  let prismaField = `${field.name} ${mapFieldType(field.type)}`;

  if (field.nullable) {
    prismaField += "?";
  }

  if (field.primaryKey) {
    prismaField += " @id";
  }

  if (field.defaultValue) {
    prismaField += ` @default(${mapDefaultValue(field)})`;
  }

  if (field.unique) {
    prismaField += " @unique";
  }

  return prismaField;
}

function generatePrismaRelation(model: string, relation: IRelation): string {
  let prismaRelation = `${relation.name} ${relation.model}`;

  if (relation.type === "has-many") {
    prismaRelation += "[]";
  }

  if (relation.nullable) {
    prismaRelation += "?";
  }

  if (relation.type === "belongs-to") {
    prismaRelation += `@relation(fields: [${relation.name}${capitalizeFirstLetter(
      relation.references,
    )}], references: [${relation.references}])`;
  }

  if (relation.primaryKey) {
    prismaRelation += " @id";
  }

  if (relation.unique) {
    prismaRelation += " @unique";
  }

  if (relation.type === "belongs-to") {
    prismaRelation += `\n  ${relation.name}${capitalizeFirstLetter(relation.references)} ${mapFieldType(
      relation.referencesType,
    )}`;
  }

  return prismaRelation;
}

function generatePrismaModel(model: IModel): string {
  let prismaModel = `model ${model.name} {`;

  // Generate fields
  model.fields.forEach(field => {
    prismaModel += `\n  ${generatePrismaField(field)}`;
  });

  // Generate relations
  if (model.relations) {
    model.relations.forEach(relation => {
      prismaModel += `\n  ${generatePrismaRelation(model.name, relation)}`;
    });
  }

  prismaModel += default_rows;

  prismaModel += "\n}\n";

  return prismaModel;
}

export default function main() {
  // read schema files
  const models = readModelFiles();
  let prismaSchema = models.map(model => generatePrismaModel(model)).join("\n");
  prismaSchema = generateDataSource() + generateDefinedModels(models) + prismaSchema;

  // write the schema file
  const schemaFilePath = path.join(process.cwd(), "prisma", "schema.prisma"); // Change 'prisma' to your actual folder name

  if (!fs.existsSync(path.join(process.cwd(), "prisma"))) {
    try {
      fs.mkdirSync(path.join(process.cwd(), "prisma"), { recursive: true });
      console.log(`Directory created: ${path.join(process.cwd(), "prisma")}`);
    } catch (err) {
      console.error("Error creating directory:", err);
    }
  }

  fs.writeFileSync(schemaFilePath, prismaSchema);
}
