import {
  Router,
  helpers,
  Status,
} from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { validateEmail } from "../utils/validator.ts";
import { QueServerAPI, VerDBAPI } from "../services/api/index.ts";
import { sendMail } from "../services/mailService.ts";

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

  // 가입은 안됐지만 이미 검증과정을 거친 메일인 경우 Status.AlreadyReported 반환
  try {
    if (await VerDBAPI.checkAlreadyVerified(mailAddr)) {
      context.response.status = Status.AlreadyReported;
      context.response.body = { msg: "You already passed verification." };
      return;
    }
  } catch (error) {
    // 업데이트 횟수가 지나치게 많은 경우 확인
    if (error.message === "429") {
      context.response.status = Status.TooManyRequests;
      context.response.body = { msg: "Too many requests." };
      return;
    } else throw error;
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

/** 인증 코드 확인 요청 */
router.post("/verification", async (context) => {
  console.log(context.request.hasBody);
  context.response.body = await context.request.body({ type: "json" }).value;
});

export default router;
