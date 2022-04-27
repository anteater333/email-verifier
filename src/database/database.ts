import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.29.4/mod.ts";
import appConfig from "../config/config.ts";

// mongodb 의존 코드
class DBClient {
  private static dbInstance: Database | undefined;

  private constructor() {}

  /** DB 연결 초기화 */
  public static async init() {
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

      this.dbInstance = dbInstance;
    } catch (error) {
      throw error;
    }
  }

  /** DB Client 인스턴스 */
  public static getDatabase() {
    if (!this.dbInstance) throw new Error("Database error");
    return this.dbInstance;
  }
}

export default { init: DBClient.init, getDatabase: DBClient.getDatabase };
