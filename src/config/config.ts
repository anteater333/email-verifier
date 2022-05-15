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
  FIREBASE_KEY?: string;
  FIREBASE_DOMAIN?: string;
  FIREBASE_PROJECT?: string;
  FIREBASE_STORAGE?: string;
  FIREBASE_MESSAGE_SENDER?: string;
  FIREBASE_APP_ID?: string;
  FIREBASE_MEASUREMENT?: string;
  MODE?: "development" | "deployment";
};

const appConfig: AppConfigType = await config();

export default appConfig;
