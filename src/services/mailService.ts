import { SmtpClient } from "https://deno.land/x/denomailer@0.16.4/mod.ts";
import appConfig from "../config/config.ts";

/** 랜덤 6자리 코드 생성 */
function genCode() {
  return Math.random().toString().slice(2, 8);
}

/** 인증 번호가 담긴 메일을 전송하는 서비스 메소드 */
const sendMail = async (): Promise<boolean> => {
  const code = genCode();

  const client = new SmtpClient();

  let result: boolean;
  try {
    await client.connect({
      hostname: appConfig.SMTP_HOST_NAME!,
      port: parseInt(appConfig.SMTP_PORT!),
      username: appConfig.SMTP_USERNAME,
      password: appConfig.SMTP_PASSWORD,
    });

    await client.send({
      from: appConfig.SMTP_USERNAME!,
      to: "zx1056@naver.com",
      subject: "Que 인증 번호입니다.",
      content: "auto",
      html: `<h1>${code}</h1>`,
    });

    result = true;
  } catch (error) {
    console.error(error);
    result = false;
  } finally {
    await client.close();
  }

  return result;
};

export default sendMail;
