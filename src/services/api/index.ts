import firebase from "./firebase/client.ts";
import {
  checkDBForAlreadyVerified,
  upsertVerification,
  getVerification,
  tryVerification,
} from "./verificationDatabase/methods.ts";
import { VerificationSchema } from "../../database/schema.ts";

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
  /** 저장된 검증정보 가져오기 */
  getVerification: (mail: string) => Promise<VerificationSchema | undefined>;
  /** 검증 여부 저장하기 */
  tryVerification: (mail: string, code: string) => Promise<boolean>;
} = {
  checkAlreadyVerified: checkDBForAlreadyVerified,
  makeVerification: upsertVerification,
  getVerification: getVerification,
  tryVerification: tryVerification,
};

export { VerDBAPI, QueServerAPI };
