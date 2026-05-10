import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";

/**
 * Saves event registration data to Firestore
 */
export const saveEventRegistration = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, "event_registrations"), {
      ...formData,
      type: "EVENT_ENTRY",
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving event registration:", error);
    throw error;
  }
};

/**
 * Saves master class registration data to Firestore
 */
export const saveMasterRegistration = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, "master_registrations"), {
      ...formData,
      type: "MASTER_CLASS",
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving master registration:", error);
    throw error;
  }
};

/**
 * Fetches all event registrations
 */
export const getEventRegistrations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "event_registrations"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort manually in JS to avoid Firestore's "missing field" exclusion
    return data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    throw error;
  }
};

/**
 * Fetches all master class registrations
 */
export const getMasterRegistrations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "master_registrations"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort manually in JS
    return data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
  } catch (error) {
    console.error("Error fetching master registrations:", error);
    throw error;
  }
};

/**
 * Saves initial aptitude test lead data
 */
export const saveAptitudeLead = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, "aptitude_test_leads"), {
      ...formData,
      status: "started",
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving aptitude lead:", error);
    throw error;
  }
};

/**
 * Updates aptitude test lead with final score
 */
export const updateAptitudeScore = async (leadId, scoreData) => {
  try {
    const { doc, updateDoc } = await import("firebase/firestore");
    const leadRef = doc(db, "aptitude_test_leads", leadId);
    await updateDoc(leadRef, {
      ...scoreData,
      status: "completed",
      completedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating aptitude score:", error);
    throw error;
  }
};

/**
 * Fetches all aptitude test leads
 */
export const getAptitudeLeads = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "aptitude_test_leads"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt descending
    return data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  } catch (error) {
    console.error("Error fetching aptitude leads:", error);
    throw error;
  }
};
