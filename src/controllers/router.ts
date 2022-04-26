import {
  Router,
  helpers,
  Status,
} from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { validateEmail, validatePassword } from "../utils/validator.ts";
import { QueServerAPI, VerDBAPI } from "../services/api/index.ts";
import { sendMail, verifyCode } from "../services/verificationService.ts";

const router = new Router({ prefix: "/api/v1" });

/** 인증 메일 전송 요청 */
router.get("/verification", async (context) => {
  // 파라미터 검사
  const mailAddr = helpers.getQuery(context).mail;
  if (!mailAddr) {
    context.response.status = Status.BadRequest;
    context.response.body = {
      msg: "Mail address required.",
    };
    return;
  }

  // 메일 1차 검증
  if (!validateEmail(mailAddr)) {
    context.response.status = Status.BadRequest;
    context.response.body = {
      msg: "Invalid mail address.",
    };
    return;
  }

  // 이미 가입한 회원인지 확인
  if (!(await QueServerAPI.checkAlreadyExists(mailAddr))) {
    context.response.status = Status.Conflict;
    context.response.body = {
      msg: "Already Exists",
    };
    return;
  }

  const verData = await VerDBAPI.getVerification(mailAddr);
  if (verData?.verified) {
    // 가입은 안됐지만 이미 검증과정을 거친 메일인 경우 Status.AlreadyReported 반환
    context.response.status = Status.AlreadyReported;
    context.response.body = { msg: "You already passed verification." };
    return;
  } else if (verData && verData?.updateCount >= 10) {
    // 업데이트 횟수가 지나치게 많은 경우 확인
    context.response.status = Status.TooManyRequests;
    context.response.body = { msg: "Too many requests." };
    return;
  }

  // 검증 메일 전송 요청 (시간이 오래 걸리므로 비동기 처리)
  if (await sendMail(mailAddr)) {
    context.response.status = Status.OK;
    context.response.body = {
      msg: "You have successfully requested a verification mail.",
    };
  } else {
    context.response.status = Status.InternalServerError;
    context.response.body = { msg: "Internal Server Error. Report me." };
  }
});

type VerReqBodyType = {
  mail: string;
  code: string;
};

/** 인증 코드 확인 요청 */
router.post("/verification", async (context) => {
  if (!context.request.hasBody) {
    context.response.status = Status.BadRequest;
    context.response.body = { msg: "Request body required." };
    return;
  }
  const reqBody: VerReqBodyType = await context.request.body({ type: "json" })
    .value;

  /** body 제대로 입력했는지 여부 */
  if (!reqBody.code || !reqBody.mail) {
    context.response.status = Status.BadRequest;
    context.response.body = { msg: "Missing body parameters." };
  }

  const mailAddr = reqBody.mail;
  const code = reqBody.code;

  try {
    const result = await verifyCode(mailAddr, code);

    if (!result) {
      // 잘못된 정보 입력
      context.response.status = Status.Forbidden;
      context.response.body = { msg: "Wrong code" };
      return;
    }

    context.response.status = Status.OK;
    context.response.body = {
      msg: "Email address verified",
    };
    return;
  } catch (error) {
    if (error.message === "429") {
      // 시도 횟수가 지나치게 많은 경우 확인
      context.response.status = Status.TooManyRequests;
      context.response.body = { msg: "Too many requests." };
      return;
    } else if (error.message === "404") {
      // 그런 이메일 없습니다.
      context.response.status = Status.NotFound;
      context.response.body = { msg: "No such email" };
      return;
    } else if (error.message === "408") {
      // 시간(ex. 5분) 지난 인증 정보
      context.response.status = Status.RequestTimeout;
      context.response.body = { msg: "Request timeout" };
    } else throw error;
  }
});

type SignUpReqBodyType = {
  mail: string;
  password: string;
};

/** 회원 가입 요청 */
router.post("/signup", async (context) => {
  if (!context.request.hasBody) {
    context.response.status = Status.BadRequest;
    context.response.body = { msg: "Request body required." };
    return;
  }

  const reqBody: SignUpReqBodyType = await context.request.body({
    type: "json",
  }).value;

  /** body 제대로 입력했는지 여부 */
  if (!reqBody.password || !reqBody.mail) {
    context.response.status = Status.BadRequest;
    context.response.body = { msg: "Missing body parameters." };
  }

  const mailAddr = reqBody.mail;
  const pwd = reqBody.password;

  /** 비밀번호 검증 */
  if (!validatePassword(pwd)) {
    context.response.status = Status.BadRequest;
    context.response.body = { msg: "Invalid password." };
    return;
  }

  const verData = await VerDBAPI.getVerification(mailAddr);
  if (!verData) {
    // 메일 인증 먼저 하시오
    context.response.status = Status.NotFound;
    context.response.body = { msg: "Verify your mail first." };
    return;
  }

  if (!verData.verified) {
    // 메일 인증 아직 안됐음
    context.response.status = Status.Forbidden;
    context.response.body = { msg: "Input your code first." };
    return;
  }

  // !! 서비스 회원가입 !!
  try {
    await QueServerAPI.createUser(mailAddr, pwd);

    context.response.status = Status.Created;
    context.response.body = { msg: "User successfully created." };

    // 필요없어진 검증 정보 삭제하기
    VerDBAPI.deleteVerification(mailAddr).catch((error) => {
      console.error("Error while deleting finished verification data.");
      console.error(error);
    });
  } catch (error) {
    console.error(error);
    context.response.status = Status.InternalServerError;
    context.response.body = { msg: "Internal Server Error. Report me." };
  }
});

export default router;
