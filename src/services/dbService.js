import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

/**
 * Normalizes phone numbers to last 10 digits for consistent comparison
 */
const normalizePhone = (phone) => {
  if (!phone) return "";
  return phone.toString().replace(/\D/g, "").slice(-10);
};

/**
 * Checks if a mobile number is already registered for the event
 */
export const checkEventRegistrationExists = async (phone) => {
  try {
    const normalizedPhone = normalizePhone(phone);
    const querySnapshot = await getDocs(collection(db, "event_registrations"));
    return querySnapshot.docs.some(doc => normalizePhone(doc.data().phone) === normalizedPhone);
  } catch (error) {
    console.error("Error checking event registration:", error);
    return false;
  }
};

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
 * Checks if a mobile number is already registered for the master class
 */
export const checkMasterRegistrationExists = async (phone) => {
  try {
    const normalizedPhone = normalizePhone(phone);
    const querySnapshot = await getDocs(collection(db, "master_registrations"));
    return querySnapshot.docs.some(doc => normalizePhone(doc.data().phone) === normalizedPhone);
  } catch (error) {
    console.error("Error checking master registration:", error);
    return false;
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
    // Sort by timestamp descending (latest first)
    const sorted = data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
    
    // Filter unique by normalized phone number
    const seen = new Set();
    return sorted.filter(item => {
      const normalized = normalizePhone(item.phone);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
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
    // Sort by timestamp descending
    const sorted = data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
    
    // Filter unique by normalized phone
    const seen = new Set();
    return sorted.filter(item => {
      const normalized = normalizePhone(item.phone);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
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
    const sorted = data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    
    // Filter unique by normalized phone
    const seen = new Set();
    return sorted.filter(item => {
      const normalized = normalizePhone(item.phone);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  } catch (error) {
    console.error("Error fetching aptitude leads:", error);
    throw error;
  }
};
/**
 * Marks attendance for a student using their paymentId
 */
export const markAttendance = async (paymentId) => {
  try {
    const q = query(collection(db, "master_registrations"), where("paymentId", "==", paymentId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Student not found or invalid QR code.");
    }

    const studentDoc = querySnapshot.docs[0];
    const studentRef = doc(db, "master_registrations", studentDoc.id);

    await updateDoc(studentRef, {
      attended: true,
      attendedAt: serverTimestamp(),
    });

    return { success: true, studentName: studentDoc.data().name };
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw error;
  }
};

/**
 * Fetches only those who have attended Master Class
 */
export const getAttendanceList = async () => {
  try {
    const q = query(collection(db, "master_registrations"), where("attended", "==", true));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sorted = data.sort((a, b) => (b.attendedAt?.seconds || 0) - (a.attendedAt?.seconds || 0));
    
    // Filter unique by normalized phone
    const seen = new Set();
    return sorted.filter(item => {
      const normalized = normalizePhone(item.phone);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  } catch (error) {
    console.error("Error fetching attendance list:", error);
    throw error;
  }
};

/**
 * Marks attendance for a student in the WORKSHOP
 */
export const markEventAttendance = async (regId) => {
  try {
    const q = query(collection(db, "event_registrations"), where("registrationId", "==", regId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Workshop student not found or invalid QR.");
    }

    const studentDoc = querySnapshot.docs[0];
    const studentRef = doc(db, "event_registrations", studentDoc.id);

    await updateDoc(studentRef, {
      attended: true,
      attendedAt: serverTimestamp(),
      attendanceStatus: "Checked-In"
    });

    return { success: true, studentName: studentDoc.data().fullName };
  } catch (error) {
    console.error("Error marking event attendance:", error);
    throw error;
  }
};

/**
 * Fetches workshop attendance list
 */
export const getEventAttendanceList = async () => {
  try {
    const q = query(collection(db, "event_registrations"), where("attended", "==", true));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sorted = data.sort((a, b) => (b.attendedAt?.seconds || 0) - (a.attendedAt?.seconds || 0));
    
    // Filter unique by normalized phone
    const seen = new Set();
    return sorted.filter(item => {
      const normalized = normalizePhone(item.phone);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  } catch (error) {
    console.error("Error fetching event attendance list:", error);
    throw error;
  }
};
