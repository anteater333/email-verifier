import { config } from "https://deno.land/std@0.136.0/dotenv/mod.ts";

type AppConfigType = {
  SMTP_HOST_NAME?: string;
  SMTP_PORT?: string;
  SMTP_USERNAME?: string;
  SMTP_PASSWORD?: string;
  MONGO_HOST?: string;
  MONGO_PORT?: string;
  MONGO_USERNAME?: string;
  MONGO_PASSWORD?: string;
  MONGO_DATABASE?: string;
  SERVER_PORT?: string;
};

const appConfig: AppConfigType = await config();

export default appConfig;
