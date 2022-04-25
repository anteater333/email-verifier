import { MongoClient } from "https://deno.land/x/mongo@v0.29.4/mod.ts";
import appConfig from "../config.ts";

const database = {
  init: async function () {
    try {
      const dbInstance = await new MongoClient().connect({
        db: appConfig.MONGO_DATABASE!,
        servers: [
          {
            host: appConfig.MONGO_HOST!,
            port: parseInt(appConfig.MONGO_PORT!),
          },
        ],
        //  credential: {}  // TODO 서버 인스턴스에 배포 시 계정 설정
      });

      console.log(
        "Database connected :",
        appConfig.MONGO_HOST,
        dbInstance.name
      );

      return dbInstance;
    } catch (error) {
      throw error;
    }
  },
};

export default database;
