import admin from "firebase-admin";

if (!process.env.FIREBASE_ADMIN_SDK) {
  throw new Error("FIREBASE_ADMIN_SDK environment variable not set");
}

// Parse Firebase service account JSON from env variable
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
} catch (err) {
  throw new Error("Invalid JSON in FIREBASE_ADMIN_SDK environment variable");
}

// Fix private key newlines (important)
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;