import admin from "firebase-admin";
import dotenv from "dotenv";
import serviceAccount from "./firebase-key.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;