import nodemailer from "nodemailer";

console.log(
  nodemailer.getTestMessageUrl({
    envelope: undefined,
    messageId: "",
    response: "",
    accepted: [],
    rejected: [],
    pending: [],
  })
);
