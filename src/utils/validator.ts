/**
 * 문자열을 입력받아 그것이 email 주소의 형태를 가지고 있는 지 판명하는 함수.
 * @param mailAddress 검증하려는 메일 주소
 * @returns 검증 통과 여부
 */
export function validateEmail(mailAddress: string) {
  const mailRegex = /^\S+@\S+\.\S+$/;

  const result = new RegExp(mailRegex).test(mailAddress);

  return result;
}
