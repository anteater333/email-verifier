import Database from "../../../database/database.ts";
import { VerificationSchema } from "../../../database/schema.ts";

/** 메일을 통해 인증 정보를 가져옴 */
export const getVerification = async (
  mail: string
): Promise<VerificationSchema | undefined> => {
  const db = Database.getDatabase();

  const verCol = db.collection<VerificationSchema>("verifications");

  return await verCol.findOne({ email: mail });
};

export const checkDBForAlreadyVerified = async (mail: string) => {
  const verData = await getVerification(mail);
  if (!verData) {
    // 아직 인증 정보 없음
    return false;
  }

  // Too many update!
  if (verData.updateCount >= 10) {
    throw new Error("429");
  }

  // 저장된 인증 성공 여부 반환
  return verData.verified;
};

export const upsertVerification = async (mail: string, code: string) => {
  const db = Database.getDatabase();

  const verCol = db.collection<VerificationSchema>("verifications");

  // 먼저 이미 저장된게 있는지 확인
  const verData = await verCol.findOne({ email: mail });

  const upsertData: VerificationSchema = {
    email: mail,
    verCode: code,
    trialCount: 0,
    updateCount: verData ? verData.updateCount + 1 : 0,
    createdAt: new Date(),
    verified: false,
  };

  if (!verData) {
    await verCol.insertOne(upsertData);
  } else {
    await verCol.updateOne({ email: mail }, { $set: upsertData });
  }
};

/** 검증 */
export const tryVerification = async (mail: string, code: string) => {
  const db = Database.getDatabase();
  const verCol = db.collection<VerificationSchema>("verifications");

  const verData = await verCol.findOne({ email: mail });

  /** 정답 */
  const verCode = verData?.verCode;

  if (verCode === code) {
    // 정답
    await verCol.updateOne({ email: mail }, { $set: { verified: true } });
    return true;
  } else {
    // 오답
    await verCol.updateOne(
      { email: mail },
      { $set: { trialCount: verData!.trialCount++ } }
    );
    return false;
  }
};
