// deno-lint-ignore-file no-explicit-any
import {
  initializeApp,
  getApps,
  getApp,
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  where,
  query,
  getDocs,
  setDoc,
  doc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

import appConfig from "../../../config/config.ts";
import { generateRandomNickname } from "../../../utils/generator.ts";

const firebaseConfig = {
  apiKey: appConfig.FIREBASE_KEY,
  authDomain: appConfig.FIREBASE_DOMAIN,
  projectId: appConfig.FIREBASE_PROJECT,
  storageBucket: appConfig.FIREBASE_STORAGE,
  messagingSenderId: appConfig.FIREBASE_MESSAGE_SENDER,
  appId: appConfig.FIREBASE_APP_ID,
  measurementId: appConfig.FIREBASE_MEASUREMENT,
};

let firebaseApp: any;

if (!getApps().length) firebaseApp = initializeApp(firebaseConfig);
else firebaseApp = getApp();

export default {
  checkUserByEmail: async function (mail: string): Promise<boolean> {
    const firestore = getFirestore(firebaseApp);
    const userCol = collection(firestore, "users");
    const condition = where("email", "==", mail);
    const userMailQuery = query(userCol, condition);
    try {
      const querySnapshot = await getDocs(userMailQuery);

      if (querySnapshot.docs.length > 0) {
        // 이메일 이미 존재
        return false;
      }
      return true;
    } catch (error) {
      throw error;
    }
  },
  createUser: async function (mail: string, password: string): Promise<void> {
    const auth = getAuth(firebaseApp);
    try {
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        mail,
        password
      );

      // spark 요금 사용 중입니다.
      // firebase function 대신 firestore 문서 생성하기
      const firestore = getFirestore();
      const newUserDocRef = doc(firestore, "users", createdUser.user.uid);
      await setDoc(newUserDocRef, {
        email: createdUser.user.email,
        registeredAt: Timestamp.fromDate(
          new Date(createdUser.user.metadata.creationTime)
        ),
        nickname: generateRandomNickname(),
        description: "",
        profilePictureUrl: "",
      });

      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },
};
