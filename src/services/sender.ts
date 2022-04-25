import { SmtpClient } from "https://deno.land/x/denomailer@0.16.4/mod.ts";
import appConfig from "../config.ts";

const sendMail = async (): Promise<boolean> => {
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
      html: "<h1>111111</h1>",
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
