import { SmtpClient } from "https://deno.land/x/denomailer/mod.ts";

const sendMail = async (): Promise<boolean> => {
  const client = new SmtpClient();

  let result: boolean;
  try {
    await client.connect({
      hostname: "smtp.gmail.com",
      port: 587,
      username: "anteater1056@gmail.com",
      password: "exbesyrmjvtpcbdx",
    });

    await client.send({
      from: "anteater1056@gmail.com",
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
