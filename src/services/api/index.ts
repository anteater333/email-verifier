import firebase from "./firebase/client.ts";
import {
  checkDBForAlreadyVerified,
  upsertVerification,
} from "./verificationDatabase/methods.ts";

const QueAPIClient = firebase;

/** Que 서비스 백엔드 서비스에 접근하는 API 목록 */
const QueServerAPI: {
  /** 이미 가입한 이메일인지 여부 확인 */
  checkAlreadyExists: (mail: string) => Promise<boolean>;
} = {
  checkAlreadyExists: QueAPIClient.checkUserByEmail,
};

/** 검증 정보 Database에 접근하는 API 목록 */
const VerDBAPI: {
  /** 검증 과정을 마친 이메일인지 여부 확인 */
  checkAlreadyVerified: (mail: string) => Promise<boolean>;
  /** 새 검증 정보 생성 */
  makeVerification: (mail: string, code: string) => Promise<void>;
} = {
  checkAlreadyVerified: checkDBForAlreadyVerified,
  makeVerification: upsertVerification,
};

export { VerDBAPI, QueServerAPI };
