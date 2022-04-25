import firebase from "./firebase/client.ts";

const QueAPIClient = firebase;

const QueServerAPI: {
  /** 이미 가입한 이메일인지 여부 확인 */
  checkAlreadyExists: (mail: string) => Promise<boolean>;
} = {
  checkAlreadyExists: QueAPIClient.checkUserByEmail,
};

export default QueServerAPI;
