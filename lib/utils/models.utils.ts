import * as fs from "fs";
import * as path from "path";
import { IField, IFieldType, IModel, IRelation } from "../types/model";

// Function to read all TypeScript files in the "model" folder
export function readModelFiles(): IModel[] {
  const modelsFolder = path.join(process.cwd(), "app/models"); // Change 'models' to your actual folder name
  const modelFiles = fs.readdirSync(modelsFolder);

  return modelFiles.map(file => {
    const filePath = path.join(modelsFolder, file);
    return require(filePath).default;
  });
}
