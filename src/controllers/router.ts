import {
  Router,
  BodyOptionsContentTypes,
} from "https://deno.land/x/oak@v10.5.1/mod.ts";

const router = new Router({ prefix: "/api/v1" });

/** 인증 메일 전송 요청 */
router.get("/verification", (context) => {
  context.response.body = "Received a GET HTTP method";
});

/** 인증 코드 확인 요청 */
router.post("/verification", async (context) => {
  console.log(context.request.hasBody);
  context.response.body = await context.request.body({ type: "json" }).value;
});

export default router;
