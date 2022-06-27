// lightweight ODM

import { ObjectId } from "https://deno.land/x/mongo@v0.29.4/mod.ts";

export interface VerificationSchema {
  /** uuid */
  _id?: ObjectId;
  /** email 주소 */
  email: string;
  /** 인증 코드 */
  verCode: string;
  /** 시도 횟수 */
  trialCount: number;
  /** 업데이트 횟수, TBD 너무 많이 요청하는걸 막기 */
  updateCount: number;
  /** 검증 생성 시각*/
  createdAt: Date;
  /** 인증 성공 여부 */
  verified: boolean;
}
