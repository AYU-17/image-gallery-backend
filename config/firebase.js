import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to service account JSON. Allow override via env var.
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`Firebase service account not found at ${serviceAccountPath}. Place your service account JSON there or set GOOGLE_APPLICATION_CREDENTIALS.`);
  throw new Error("Firebase service account not found. See config/serviceAccountKey.json or set GOOGLE_APPLICATION_CREDENTIALS.");
}

let serviceAccountRaw;
try {
  serviceAccountRaw = fs.readFileSync(serviceAccountPath, "utf8");
} catch (err) {
  throw new Error(`Unable to read Firebase service account file: ${err.message}`);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountRaw);
} catch (err) {
  throw new Error(`Invalid JSON in Firebase service account file: ${err.message}`);
}

// Fix private key newlines if present
if (serviceAccount.private_key && typeof serviceAccount.private_key === "string") {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;