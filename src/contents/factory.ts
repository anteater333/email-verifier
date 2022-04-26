import { html } from "https://deno.land/x/html@v1.2.0/mod.ts";

/** 인증 코드를 메일에 담아 보낼 수 있도록 html 문서 동적으로 생성하는 함수 */
export const codeMailContent = (code: string) => {
  // TBD 더 이쁘게 꾸미기
  return html`
    <body>
      <div>
        <h1>Que 회원가입 메일 인증 코드입니다.</h1>
        <br />
        <h2>${code}</h2>
      </div>
    </body>
  `;
};
