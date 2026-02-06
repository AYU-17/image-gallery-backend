import admin from "firebase-admin";

let serviceAccount;

if (process.env.FIREBASE_ADMIN_SDK) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
  } catch (err) {
    throw new Error("Invalid JSON in FIREBASE_ADMIN_SDK environment variable");
  }
} else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  };
} else {
  throw new Error("FIREBASE_ADMIN_SDK or individual FIREBASE_* environment variables not set");
}

// Fix private key newlines (important)
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;