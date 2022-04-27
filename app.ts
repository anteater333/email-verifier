import { Application } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import appConfig from "./src/config/config.ts";
import router from "./src/controllers/router.ts";
import Database from "./src/database/database.ts";

const app = new Application();

/** start db connection */
await Database.init();

const serverPort = parseInt(appConfig.SERVER_PORT!);

/** Logger middleware */
app.use(async (context, next) => {
  await next();
  const responseTime = context.response.headers.get("X-Response-Time");
  console.log(
    `${context.response.status} ${context.request.method} ${context.request.url} - ${responseTime}`
  );
});

/** Response Timer */
app.use(async (context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", () => {
  console.log(`The server listening on port ${serverPort}`);
});

await app.listen({ port: serverPort });
