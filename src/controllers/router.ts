import {
  Router,
  helpers,
  Status,
} from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { validateEmail } from "../utils/validator.ts";
import QueServerAPI from "../services/api/index.ts";

const router = new Router({ prefix: "/api/v1" });

/** 인증 메일 전송 요청 */
router.get("/verification", async (context) => {
  // 파라미터 검사
  const { mail } = helpers.getQuery(context);
  if (!mail) {
    context.response.status = Status.BadRequest;
    context.response.body = {
      msg: "Mail address required.",
    };
    return;
  }

  // 메일 1차 검증
  if (!validateEmail(mail)) {
    context.response.status = Status.BadRequest;
    context.response.body = {
      msg: "Invalid mail address.",
    };
    return;
  }

  // 이미 가입한 회원인지 확인
  if (!(await QueServerAPI.checkAlreadyExists(mail))) {
    context.response.status = Status.Conflict;
    context.response.body = {
      msg: "Already Exists",
    };
    return;
  }

  // 검증 메일 전송 요청 (시간이 오래 걸리므로 비동기 처리)
  context.response.status = Status.OK;
  context.response.body = "Received a GET HTTP";
});

/** 인증 코드 확인 요청 */
router.post("/verification", async (context) => {
  console.log(context.request.hasBody);
  context.response.body = await context.request.body({ type: "json" }).value;
});

export default router;
