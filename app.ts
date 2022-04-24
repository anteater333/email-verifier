import { serve } from "https://deno.land/std@0.136.0/http/server.ts";

import sendMail from "./src/sender.ts";

const sendMailHandler = async (req: Request): Promise<Response> => {
  console.log("request,", req);
  if (await sendMail()) {
    return new Response("good", { status: 200 });
  } else {
    return new Response("bad", { status: 500 });
  }
};

serve(sendMailHandler);

console.log("server listening...");
