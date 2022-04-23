import nodemailer from "nodemailer";

const options = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "anteater1056@gmail.com",
    pass: "exbesyrmjvtpcbdx",
  },
};

const transporter = nodemailer.createTransport({
  ...options,
});

const mailDestination = "zx1056@naver.com";
transporter
  .sendMail({
    from: `"Que" no-reply-que@gmail.com`,
    to: mailDestination,
    subject: "QUE 인증메일",
    text: "111111 입니다.",
  })
  .then((result) => {
    console.log(result.response);
  });
