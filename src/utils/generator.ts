/** 형용사 */
const prefixes = [
  "용감한",
  "잘생긴",
  "고고한",
  "춤추는",
  "노래하는",
  "귀여운",
  "똑똑한",
  "차가운",
  "따뜻한",
  "순박한",
  "배부른",
  "부지런한",
  "깨끗한",
  "이상한",
];
/** 동물 */
const postfixes = [
  "고양이",
  "펭귄",
  "햄스터",
  "개미핥기",
  "스컹크",
  "강아지",
  "청새치",
  "멧돼지",
  "원숭이",
  "토끼",
  "기린",
  "도마뱀",
  "백상아리",
  "해파리",
  "호랑이",
  "사자",
  "비둘기",
  "고래",
  "문어",
  "코뿔소",
  "구렁이",
  "순록",
  "사람",
];

/**
 * 랜덤 닉네임을 생성하는 함수
 * @returns 형용사 + 동물 + 임의의 4자리 숫자
 */
export function generateRandomNickname(): string {
  const pre = prefixes[Math.floor(Math.random() * prefixes.length)];
  const post = postfixes[Math.floor(Math.random() * postfixes.length)];

  return pre + post + genCode(4);
}

/** 랜덤 N자리 코드 생성 */
export function genCode(N = 6): string {
  const seed = Math.floor(Math.random() * 10 ** (N + 2));
  return (seed.toString() + "000000").slice(1, N + 1);
}
