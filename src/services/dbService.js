import { db, storage } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, where, updateDoc, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
      if (item.type === "WEBINAR") return false;
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
 * Saves slot registration data to Firestore
 */
export const saveSlotRegistration = async (formData) => {
  try {
    const docRef = doc(db, "slot_registrations", formData.fullName);
    await setDoc(docRef, {
      ...formData,
      type: "SLOT",
      timestamp: serverTimestamp(),
    });
    return { success: true, id: formData.fullName };
  } catch (error) {
    console.error("Error saving slot registration:", error);
    throw error;
  }
};

/**
 * Fetches all slot registrations
 */
export const getSlotRegistrations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "slot_registrations"));
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
    console.error("Error fetching slot registrations:", error);
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

/**
 * Marks attendance for a student using their Firestore document ID
 */
export const markAttendanceById = async (collectionName, docId) => {
  try {
    const studentRef = doc(db, collectionName, docId);
    
    await updateDoc(studentRef, {
      attended: true,
      attendedAt: serverTimestamp(),
      ...(collectionName === "event_registrations" ? { attendanceStatus: "Checked-In" } : {})
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error marking attendance by ID:", error);
    throw error;
  }
};

/**
 * Saves a batch of collected contacts to Firestore
 */
export const saveCollectedContacts = async (ownerName, contacts) => {
  try {
    const docRef = await addDoc(collection(db, "collected_contacts"), {
      ownerName,
      contacts,
      count: contacts.length,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving collected contacts:", error);
    throw error;
  }
};

/**
 * Fetches all collected contact batches
 */
export const getCollectedContacts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "collected_contacts"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by timestamp descending
    return data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
  } catch (error) {
    console.error("Error fetching collected contacts:", error);
    throw error;
  }
};
/**
 * Updates the AI/ML course enrollment interest for any registration
 */
export const updateCourseInterest = async (collectionName, docId, interested) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      enrolledInAICourse: interested ? "Yes" : "No",
      enrollmentTimestamp: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating course interest:", error);
    throw error;
  }
};
/**
 * Updates the confirmation status for a registration
 */
export const updateConfirmationStatus = async (collectionName, docId, status) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      confirmationStatus: status,
      confirmationUpdatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating confirmation status:", error);
    throw error;
  }
};

/**
 * Saves an uploaded contact file to Storage and metadata to Firestore
 */
export const saveUploadedContactFile = async (ownerName, category, file) => {
  try {
    const fileRef = ref(storage, `contact_files/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const docRef = await addDoc(collection(db, "uploaded_contact_files"), {
      ownerName,
      category,
      fileName: file.name,
      fileURL: downloadURL,
      timestamp: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving uploaded contact file:", error);
    throw error;
  }
};

/**
 * Fetches all uploaded contact file metadata
 */
export const getUploadedContactFiles = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "uploaded_contact_files"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by timestamp descending
    return data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
  } catch (error) {
    console.error("Error fetching uploaded contact files:", error);
    throw error;
  }
};

/**
 * Fetches all registered admins
 */
export const getAdmins = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "admins"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by timestamp descending
    return data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};

/**
 * Saves contact form message submissions to Firestore
 */
export const saveContactMessage = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, "contact_messages"), {
      ...formData,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw error;
  }
};

/**
 * Saves webinar registration data to Firestore (stored under event_registrations to leverage existing rules)
 */
export const saveWebinarRegistration = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, "event_registrations"), {
      ...formData,
      type: "WEBINAR",
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving webinar registration:", error);
    throw error;
  }
};

/**
 * Fetches all webinar registrations
 */
export const getWebinarRegistrations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "event_registrations"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by timestamp descending
    const sorted = data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
    
    // Filter unique by normalized phone
    const seen = new Set();
    return sorted.filter(item => {
      if (item.type !== "WEBINAR") return false;
      const normalized = normalizePhone(item.phone);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  } catch (error) {
    console.error("Error fetching webinar registrations:", error);
    throw error;
  }
};

/**
 * Saves student admission data, uploading associated documents to Cloudinary
 */
export const saveAdmissionRegistration = async (formData, files) => {
  try {
    const documentURLs = {};
    const cloudName = "dfn6pdbz";
    const uploadPreset = "firebase_upload";
    
    // Upload files to Cloudinary if they exist
    for (const [key, file] of Object.entries(files)) {
      if (file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", uploadPreset);

        // Upload all documents as 'image' resource type to support download transformations (like fl_attachment)
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || "Failed to upload file to Cloudinary");
        }

        const result = await response.json();
        documentURLs[key] = result.secure_url;
      }
    }
    
    // Add documents URL back into form data
    const submissionData = {
      ...formData,
      documents: documentURLs,
      type: "ADMISSION",
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "student_admissions"), submissionData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving admission registration:", error);
    throw error;
  }
};

/**
 * Fetches all student admission registrations
 */
export const getAdmissionRegistrations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "student_admissions"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by timestamp descending
    return data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
  } catch (error) {
    console.error("Error fetching admission registrations:", error);
    throw error;
  }
};


