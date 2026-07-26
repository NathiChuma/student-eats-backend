import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import "dotenv/config";

// firebase-admin's cert() only actually reads project_id, private_key and
// client_email off a service account object - the rest of the JSON Firebase
// hands you when you generate a key (auth_uri, token_uri, client_id, etc.)
// is unused metadata, so those are the only three that are required here.
const requiredEnvVars = ["PROJECT_ID", "PRIVATE_KEY", "CLIENT_EMAIL"] as const;

const missing = requiredEnvVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required Firebase service account environment variables: ${missing.join(", ")}. See .env.example.`,
  );
}

const serviceAccount: ServiceAccount = {
  projectId: process.env.PROJECT_ID,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.CLIENT_EMAIL,
};

initializeApp({
  credential: cert(serviceAccount),
});

export const db: Firestore = getFirestore();
