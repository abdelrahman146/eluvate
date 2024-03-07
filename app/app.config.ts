import { IAppConfig } from "../lib/types/app.config";

const appConfig: IAppConfig = {
  database: {
    provider: "postgres",
    host: "localhost",
    port: 5432,
    dbname: "app",
    dbuser: "admin",
    dbpassword: "1234",
  },
};

export default appConfig;
