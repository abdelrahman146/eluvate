type TDatabaseProvider = "postgres" | "mongo" | "mysql" | "maria" | "sqlite";

export interface IDatabaseConfig {
  provider: TDatabaseProvider;
  host: string;
  port: string | number;
  dbname: string;
  dbuser: string;
  dbpassword: string;
}

export interface IAppConfig {
  database: IDatabaseConfig;
}
