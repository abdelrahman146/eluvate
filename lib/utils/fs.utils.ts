import * as fs from "fs";
import * as path from "path";
import { IAppConfig } from "../types/app.config";

export function getAppConfig(): IAppConfig {
  const appConfigFile = path.join(process.cwd(), "app/app.config.ts");
  const appConfig = require(appConfigFile).default as IAppConfig;

  return appConfig;
}
