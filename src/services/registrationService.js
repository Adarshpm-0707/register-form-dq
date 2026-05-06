// ─────────────────────────────────────────────────────
//  services/registrationService.js
// ─────────────────────────────────────────────────────

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

const COLLECTION_NAME = "registrations";

export async function saveRegistration(formData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...formData,
      email: formData.email.trim().toLowerCase(),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Firestore write error:", error);
    throw new Error("Failed to save registration.");
  }
}
