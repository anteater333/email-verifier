import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.29.4/mod.ts";
import { VerificationSchema } from "./schema.ts";
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

      // Document에 만료일을 입력하는 인덱스를 생성합니다.
      /** 인덱스 명 */
      const expIndexName = "_expire_";
      /** 만료 시간 */
      const expTime = 1 * 86400; // a day
      /** 컬렉션 객체 */
      const verCol = dbInstance.collection<VerificationSchema>("verifications");
      /** 정의된 인덱스 목록 */
      const indexes = await verCol.listIndexes().toArray();
      /** 만료 인덱스를 이미 정의했는지 여부 판단 */
      const hasExpireIndex = indexes.find((index) => {
        return index.name === expIndexName;
      });

      if (!hasExpireIndex) {
        // 인덱스 정의되어있지 않은 경우 새로 등록
        const result = await verCol.createIndexes({
          indexes: [
            {
              key: { createdAt: 1 },
              name: expIndexName,
              expireAfterSeconds: expTime,
            },
          ],
        });
        console.log(`DB : Collection index created: ${result.ok}`);
      } else {
        // 인덱스 이미 있으면 등록하지 않고 넘어감
        console.log(`DB: Index already created`);
      }

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
