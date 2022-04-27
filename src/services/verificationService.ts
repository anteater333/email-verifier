import { SmtpClient } from "https://deno.land/x/denomailer@0.16.4/mod.ts";
import appConfig from "../config/config.ts";
import { codeMailContent } from "../contents/factory.ts";
import { VerDBAPI } from "./api/index.ts";

/** 랜덤 6자리 코드 생성 */
function genCode() {
  return Math.random().toString().slice(2, 8);
}

/** 인증 번호가 담긴 메일을 전송하는 서비스 메소드 */
export const sendMail = async (mailAddr: string): Promise<boolean> => {
  const code = genCode();

  // 생성한 랜덤 코드로 새 검증정보 생성
  await VerDBAPI.makeVerification(mailAddr, code);

  const client = new SmtpClient();
  /** 클라이언트가 너무 오래 기다리지 않도록 만들기 */
  client
    .connect({
      hostname: appConfig.SMTP_HOST_NAME!,
      port: parseInt(appConfig.SMTP_PORT!),
      username: appConfig.SMTP_USERNAME,
      password: appConfig.SMTP_PASSWORD,
    })
    .then(() => {
      client
        .send({
          from: appConfig.SMTP_USERNAME!,
          to: mailAddr,
          subject: "Que 인증 코드입니다.",
          content: "auto",
          html: codeMailContent(code),
        })
        .catch((error) => {
          console.error("Error while sending mail");
          console.error(error);
        })
        .finally(async () => {
          await client.close();
        });
    })
    .catch((error) => {
      console.error("Failed to connect to smtp host");
      console.error(error);
    });

  return true;
};

// 이 시간 지난 정보는 취급 안합니다. 단위: ms
const TIME_LIMIT = 300000;

/** 사용자가 요청한 정보 기반으로 인증 시도하기 */
export const verifyCode = async (mail: string, code: string) => {
  // 검증 정보 가져오기
  const verData = await VerDBAPI.getVerification(mail);

  /** 검증 데이터 없음 */
  if (!verData) {
    throw new Error("404");
  }

  /** 너무 오래된 검증 정보 */
  const timePassed = new Date().getTime() - verData.createdAt.getTime();
  if (timePassed > TIME_LIMIT) {
    throw new Error("408");
  }

  /** 너무 많이 요청함 */
  if (verData.trialCount >= 5) {
    throw new Error("429");
  }

  return VerDBAPI.tryVerification(mail, code);
};
