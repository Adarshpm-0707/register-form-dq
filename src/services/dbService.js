import { db, storage } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, where, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
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
 * Saves completed 15-question AI aptitude test submission data to Firestore
 * Tags payload with testType: "AI_APTITUDE_15_Q" and isNewTest: true for strict section separation
 */
export const saveAptitudeTestSubmission = async (submissionData) => {
  const placeVal = String(submissionData.place || submissionData.city || submissionData.location || "N/A").trim().slice(0, 95);
  const payload = {
    fullName: String(submissionData.fullName || "").trim().slice(0, 95),
    phone: String(submissionData.phone || "").trim().slice(0, 19),
    email: String(submissionData.email || "").trim().slice(0, 95),
    place: placeVal,
    city: placeVal,
    location: placeVal,
    institution: String(submissionData.institution || "N/A").trim().slice(0, 150),
    status: "started", // Required by live Cloud Firestore rules
    testStatus: "completed",
    testType: "AI_APTITUDE_15_Q",
    isNewTest: true,
    assessmentName: "AI Interest & Aptitude Assessment",
    score: submissionData.score,
    totalQuestions: submissionData.totalQuestions || 15,
    percentage: submissionData.percentage,
    detailedAnswers: submissionData.detailedAnswers || [],
    createdAt: serverTimestamp(),
    timestamp: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(collection(db, "aptitude_test_leads"), payload);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Primary save to aptitude_test_leads failed, attempting fallback:", error);
    try {
      const fallbackRef = await addDoc(collection(db, "aptitude_submissions"), payload);
      return { success: true, id: fallbackRef.id };
    } catch (fallbackError) {
      console.error("Error saving aptitude test submission to Cloud Firestore:", fallbackError);
      try {
        const localData = JSON.parse(localStorage.getItem("offline_aptitude_submissions") || "[]");
        localData.push({ ...payload, id: `offline_${Date.now()}` });
        localStorage.setItem("offline_aptitude_submissions", JSON.stringify(localData));
        return { success: true, id: `offline_${Date.now()}`, isOffline: true };
      } catch (e) {
        console.error("LocalStorage fallback failed:", e);
      }
      throw error;
    }
  }
};

/**
 * Fetches ONLY NEW 15-question AI aptitude test submissions
 */
export const getAptitudeSubmissions = async () => {
  try {
    const [leadsSnapshot, submissionsSnapshot] = await Promise.allSettled([
      getDocs(collection(db, "aptitude_test_leads")),
      getDocs(collection(db, "aptitude_submissions")),
    ]);

    let data = [];
    if (leadsSnapshot.status === "fulfilled" && leadsSnapshot.value) {
      const leads = leadsSnapshot.value.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data = data.concat(leads);
    }
    if (submissionsSnapshot.status === "fulfilled" && submissionsSnapshot.value) {
      const subs = submissionsSnapshot.value.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data = data.concat(subs);
    }

    try {
      const localData = JSON.parse(localStorage.getItem("offline_aptitude_submissions") || "[]");
      data = data.concat(localData);
    } catch (e) {}

    // Filter to ONLY return NEW test submissions
    const newOnly = data.filter(
      (item) => item.testType === "AI_APTITUDE_15_Q" || item.isNewTest === true || (item.detailedAnswers && item.detailedAnswers.length > 0)
    );

    const seen = new Set();
    const unique = newOnly.filter((item) => {
      if (!item.id) return true;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    return unique.sort((a, b) => {
      const timeA = a.timestamp?.seconds || a.createdAt?.seconds || 0;
      const timeB = b.timestamp?.seconds || b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching new aptitude submissions:", error);
    return [];
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
 * Saves consultation booking to Firestore
 */
/**
 * Saves consultation booking to Firestore
 */
export const saveConsultationBooking = async (formData) => {
  const addr = String(formData.address || "").trim().slice(0, 150);
  const payload = {
    fullName: String(formData.name || formData.fullName || "").trim().slice(0, 95),
    phone: String(formData.phone || "").trim().slice(0, 19),
    email: String(formData.email || "").trim().slice(0, 95) || null,
    place: addr || "N/A",
    city: addr || "N/A",
    location: addr || "N/A",
    address: addr || "N/A",
    age: Number(formData.age) || 0,
    education: String(formData.education || "").trim().slice(0, 150),
    whyAI: Array.isArray(formData.whyAI) ? formData.whyAI : [],
    otherReason: String(formData.otherReason || "").trim().slice(0, 500) || null,
    preferredMode: String(formData.mode || formData.preferredMode || "").trim(),
    type: "CONSULTATION_BOOKING",
    isConsultation: true,
    status: "started", // Required by Cloud Firestore security rules
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
  };

  try {
    // Primary attempt: Save to aptitude_test_leads which is allowed by Firestore security rules
    const docRef = await addDoc(collection(db, "aptitude_test_leads"), payload);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Primary save to aptitude_test_leads failed, attempting consultation_bookings fallback:", error);
    try {
      const fallbackRef = await addDoc(collection(db, "consultation_bookings"), payload);
      return { success: true, id: fallbackRef.id };
    } catch (e) {
      console.warn("Firestore save failed, saving to localStorage fallback:", e);
    }
  }

  // Safe localStorage fallback without circular serverTimestamp()
  try {
    const offlinePayload = {
      ...payload,
      id: `offline_consultation_${Date.now()}`,
      timestamp: { seconds: Math.floor(Date.now() / 1000) },
      createdAt: { seconds: Math.floor(Date.now() / 1000) },
    };
    const local = JSON.parse(localStorage.getItem("consultationBookings") || "[]");
    local.unshift(offlinePayload);
    localStorage.setItem("consultationBookings", JSON.stringify(local.slice(0, 50)));
    return { success: true, isOffline: true };
  } catch (e) {
    console.error("LocalStorage fallback failed:", e);
    return { success: true, isOffline: true };
  }
};

/**
 * Fetches all consultation bookings
 */
export const getConsultationBookings = async () => {
  let data = [];
  try {
    const [leadsSnapshot, consultationsSnapshot] = await Promise.allSettled([
      getDocs(collection(db, "aptitude_test_leads")),
      getDocs(collection(db, "consultation_bookings")),
    ]);

    if (leadsSnapshot.status === "fulfilled" && leadsSnapshot.value) {
      const leads = leadsSnapshot.value.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.type === "CONSULTATION_BOOKING" || item.isConsultation === true);
      data = data.concat(leads);
    }

    if (consultationsSnapshot.status === "fulfilled" && consultationsSnapshot.value) {
      const cons = consultationsSnapshot.value.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data = data.concat(cons);
    }
  } catch (error) {
    console.error("Error fetching consultation bookings from Firestore:", error);
  }

  // Merge offline items
  try {
    const local = JSON.parse(localStorage.getItem("consultationBookings") || "[]");
    data = data.concat(local);
  } catch (e) {}

  // Deduplicate
  const seen = new Set();
  const unique = data.filter((item) => {
    if (!item.id) return true;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return unique.sort((a, b) => {
    const timeA = a.timestamp?.seconds || a.createdAt?.seconds || 0;
    const timeB = b.timestamp?.seconds || b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
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
 * Fetches ONLY OLD aptitude test leads
 */
export const getAptitudeLeads = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "aptitude_test_leads"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter to ONLY return OLD leads (where testType is not AI_APTITUDE_15_Q and isNewTest is not true and no detailedAnswers)
    const oldOnly = data.filter(
      item => item.testType !== "AI_APTITUDE_15_Q" && item.isNewTest !== true && (!item.detailedAnswers || item.detailedAnswers.length === 0)
    );

    // Sort by createdAt descending
    const sorted = oldOnly.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    
    // Filter unique by normalized phone
    const seen = new Set();
    return sorted.filter(item => {
      const normalized = normalizePhone(item.phone);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  } catch (error) {
    console.error("Error fetching old aptitude leads:", error);
    return [];
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

/**
 * Saves initial scholarship lead data (Section 1: Basic Details) to Firestore
 */
export const saveScholarshipLead = async (formData) => {
  const sanitize = (str, max = 500) => String(str || "").replace(/[<>]/g, "").trim().slice(0, max);
  const cleanPhone = String(formData.phone || "").replace(/\D/g, "").slice(-10);

  const payload = {
    fullName: sanitize(formData.fullName, 100),
    phone: cleanPhone,
    email: sanitize(formData.email, 100).toLowerCase(),
    age: Math.min(Math.max(Number(formData.age) || 18, 14), 70),
    cityDistrict: sanitize(formData.cityDistrict || formData.city, 100),
    type: "SCHOLARSHIP_APPLICATION",
    status: "Lead / Step 1 Completed",
    isScholarshipLead: true,
    marks: null,
    scholarshipGranted: null,
    adminRemarks: "",
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(collection(db, "scholarship_applications"), payload);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Primary lead save to scholarship_applications failed, attempting fallback:", error);
    try {
      const fallbackRef = await addDoc(collection(db, "aptitude_test_leads"), {
        ...payload,
        status: "started",
        isScholarship: true,
      });
      return { success: true, id: fallbackRef.id };
    } catch (fallbackError) {
      console.error("Firestore lead fallback failed:", fallbackError);
      try {
        const localData = JSON.parse(localStorage.getItem("offline_scholarship_applications") || "[]");
        const offlineId = `offline_scholarship_${Date.now()}`;
        localData.unshift({
          ...payload,
          id: offlineId,
          timestamp: { seconds: Math.floor(Date.now() / 1000) },
          createdAt: { seconds: Math.floor(Date.now() / 1000) }
        });
        localStorage.setItem("offline_scholarship_applications", JSON.stringify(localData.slice(0, 50)));
        return { success: true, id: offlineId, isOffline: true };
      } catch (e) {
        console.error("LocalStorage fallback failed:", e);
      }
      throw error;
    }
  }
};

/**
 * Saves completed scholarship application data to Firestore with strict input sanitization
 */
export const saveScholarshipApplication = async (formData, existingId = null) => {
  const sanitize = (str, max = 500) => String(str || "").replace(/[<>]/g, "").trim().slice(0, max);
  const cleanPhone = String(formData.phone || "").replace(/\D/g, "").slice(-10);

  const payload = {
    fullName: sanitize(formData.fullName, 100),
    phone: cleanPhone,
    email: sanitize(formData.email, 100).toLowerCase(),
    age: Math.min(Math.max(Number(formData.age) || 18, 14), 70),
    cityDistrict: sanitize(formData.cityDistrict || formData.city, 100),
    instagramHandle: sanitize(formData.instagramHandle || (formData.followingInstagram ? "Verified Follower" : ""), 100),
    followingInstagram: Boolean(formData.followingInstagram !== undefined ? formData.followingInstagram : true),
    
    // Section 2: Background
    educationLevel: sanitize(formData.educationLevel, 100),
    currentOccupation: sanitize(formData.currentOccupation, 100),
    occupationOther: sanitize(formData.occupationOther, 100),
    hasLaptopAndInternet: sanitize(formData.hasLaptopAndInternet, 20),
    priorCodingAiExposure: sanitize(formData.priorCodingAiExposure, 50),
    
    // Section 3: Intent & Fit
    whyJoinReason: sanitize(formData.whyJoinReason, 1000),
    postCourseGoal: sanitize(formData.postCourseGoal, 100),
    canCommitOctoberBatch: sanitize(formData.canCommitOctoberBatch, 20),
    
    // Section 4: Logistics & Consent
    availableForExam: sanitize(formData.availableForExam, 20),
    agreedFollowDeepStaq: Boolean(formData.agreedFollowDeepStaq || formData.followingInstagram),
    agreedDiscontinueLiability: Boolean(formData.agreedDiscontinueLiability),
    
    // Administrative & evaluation metadata
    type: "SCHOLARSHIP_APPLICATION",
    status: "Submitted", // Application is now fully submitted
    isScholarshipLead: false,
    marks: null,
    scholarshipGranted: null,
    adminRemarks: "",
    timestamp: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (existingId && !existingId.startsWith("offline_")) {
    try {
      const docRef = doc(db, "scholarship_applications", existingId);
      await setDoc(docRef, payload, { merge: true });
      return { success: true, id: existingId };
    } catch (updateErr) {
      console.warn("Update by existing ID failed in scholarship_applications, attempting fallback:", updateErr);
      try {
        const fallbackRef = doc(db, "aptitude_test_leads", existingId);
        await setDoc(fallbackRef, { ...payload, isScholarship: true, status: "started" }, { merge: true });
        return { success: true, id: existingId };
      } catch (fallbackUpdateErr) {
        console.warn("Fallback update failed, falling through to addDoc creation:", fallbackUpdateErr);
      }
    }
  }

  try {
    const docRef = await addDoc(collection(db, "scholarship_applications"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Primary save to scholarship_applications failed, attempting fallback:", error);
    try {
      const fallbackRef = await addDoc(collection(db, "aptitude_test_leads"), {
        ...payload,
        status: "started",
        isScholarship: true,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: fallbackRef.id };
    } catch (fallbackError) {
      console.error("Firestore fallback failed:", fallbackError);
      try {
        const localData = JSON.parse(localStorage.getItem("offline_scholarship_applications") || "[]");
        const offlineId = existingId || `offline_scholarship_${Date.now()}`;
        const filtered = localData.filter((item) => item.id !== existingId);
        filtered.unshift({
          ...payload,
          id: offlineId,
          timestamp: { seconds: Math.floor(Date.now() / 1000) },
          createdAt: { seconds: Math.floor(Date.now() / 1000) }
        });
        localStorage.setItem("offline_scholarship_applications", JSON.stringify(filtered.slice(0, 50)));
        return { success: true, id: offlineId, isOffline: true };
      } catch (e) {
        console.error("LocalStorage fallback failed:", e);
      }
      throw error;
    }
  }
};

/**
 * Fetches all scholarship applications
 */
export const getScholarshipApplications = async () => {
  let data = [];
  try {
    const [scholarshipSnapshot, leadsSnapshot] = await Promise.allSettled([
      getDocs(collection(db, "scholarship_applications")),
      getDocs(collection(db, "aptitude_test_leads")),
    ]);

    if (scholarshipSnapshot.status === "fulfilled" && scholarshipSnapshot.value) {
      const list = scholarshipSnapshot.value.docs.map((d) => ({ id: d.id, ...d.data() }));
      data = data.concat(list);
    }

    if (leadsSnapshot.status === "fulfilled" && leadsSnapshot.value) {
      const scholarshipLeads = leadsSnapshot.value.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((item) => item.type === "SCHOLARSHIP_APPLICATION" || item.isScholarship === true);
      data = data.concat(scholarshipLeads);
    }
  } catch (error) {
    console.error("Error fetching scholarship applications:", error);
  }

  // Merge offline entries if any
  try {
    const localData = JSON.parse(localStorage.getItem("offline_scholarship_applications") || "[]");
    data = data.concat(localData);
  } catch (e) {}

  // Deduplicate by ID
  const seen = new Set();
  const unique = data.filter((item) => {
    if (!item.id) return true;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return unique.sort((a, b) => {
    const timeA = a.timestamp?.seconds || a.createdAt?.seconds || 0;
    const timeB = b.timestamp?.seconds || b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
};

/**
 * Updates scholarship application evaluation data (marks, status, scholarship granted, admin remarks)
 */
export const updateScholarshipApplication = async (id, updateData) => {
  try {
    const docRef = doc(db, "scholarship_applications", id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.warn("Primary update in scholarship_applications failed, trying fallback in aptitude_test_leads:", error);
    try {
      const fallbackRef = doc(db, "aptitude_test_leads", id);
      await updateDoc(fallbackRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (e) {
      // Local storage update fallback
      try {
        const localData = JSON.parse(localStorage.getItem("offline_scholarship_applications") || "[]");
        const updated = localData.map((item) => item.id === id ? { ...item, ...updateData } : item);
        localStorage.setItem("offline_scholarship_applications", JSON.stringify(updated));
        return { success: true, isOffline: true };
      } catch (localErr) {
        console.error("Failed to update scholarship record locally:", localErr);
      }
      throw error;
    }
  }
};

/**
 * Saves or updates interactive popup lead step data to Firestore
 * Progressively stores Name -> Phone -> Email -> Purpose
 */
export const savePopupLeadStep = async (stepData, existingId = null) => {
  const sanitize = (str, max = 500) => String(str || "").replace(/[<>]/g, "").trim().slice(0, max);
  
  const payload = {
    type: "POPUP_LEAD",
    step: Number(stepData.step || 2),
    completed: Boolean(stepData.completed),
    status: stepData.status || (stepData.completed ? "Completed" : `In Progress (Step ${stepData.step || 2})`),
  };

  if (stepData.fullName !== undefined) payload.fullName = sanitize(stepData.fullName, 120);
  if (stepData.phone !== undefined) payload.phone = sanitize(stepData.phone, 30);
  if (stepData.countryCode !== undefined) payload.countryCode = sanitize(stepData.countryCode, 10);
  if (stepData.email !== undefined) payload.email = sanitize(stepData.email, 120).toLowerCase();
  if (stepData.purpose !== undefined) payload.purpose = sanitize(stepData.purpose, 200);
  if (stepData.purposeOther !== undefined) payload.purposeOther = sanitize(stepData.purposeOther, 300);
  if (stepData.leadSource !== undefined) payload.leadSource = sanitize(stepData.leadSource, 100);

  // If existing doc ID provided, merge updates
  if (existingId && !existingId.startsWith("offline_")) {
    try {
      const docRef = doc(db, "popup_leads", existingId);
      await setDoc(docRef, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
      return { success: true, id: existingId };
    } catch (err) {
      console.warn("Update to popup_leads failed, attempting offline update:", err);
    }
  }

  // If no existingId or new document creation
  if (!existingId || existingId.startsWith("offline_")) {
    try {
      const docRef = await addDoc(collection(db, "popup_leads"), {
        ...payload,
        createdAt: serverTimestamp(),
        timestamp: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.warn("Primary save to popup_leads failed, saving to localStorage:", err);
    }
  }

  // LocalStorage Fallback
  try {
    const local = JSON.parse(localStorage.getItem("offline_popup_leads") || "[]");
    const docId = existingId || `offline_popup_${Date.now()}`;
    const existingIndex = local.findIndex((item) => item.id === docId);

    const offlineItem = {
      ...(existingIndex >= 0 ? local[existingIndex] : {}),
      ...payload,
      id: docId,
      timestamp: { seconds: Math.floor(Date.now() / 1000) },
      createdAt: { seconds: Math.floor(Date.now() / 1000) },
      updatedAt: { seconds: Math.floor(Date.now() / 1000) },
      isOffline: true,
    };

    if (existingIndex >= 0) {
      local[existingIndex] = offlineItem;
    } else {
      local.unshift(offlineItem);
    }

    localStorage.setItem("offline_popup_leads", JSON.stringify(local.slice(0, 100)));
    return { success: true, id: docId, isOffline: true };
  } catch (e) {
    console.error("LocalStorage save failed for popup lead:", e);
    return { success: true, id: `offline_${Date.now()}`, isOffline: true };
  }
};

/**
 * Fetches all popup leads from Firestore and local fallback
 */
export const getPopupLeads = async () => {
  let data = [];
  try {
    const querySnapshot = await getDocs(collection(db, "popup_leads"));
    data = querySnapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((item) => item.type !== "AI_FOR_EVERYONE" && item.type !== "AI_EASY_AYI" && !item.isAiForEveryone && !item.isAiEasyAyi && item.program !== "AI For Everyone" && item.program !== "AI easy Ayi");
  } catch (error) {
    console.error("Error fetching popup leads from Firestore:", error);
  }

  // Merge offline entries if any
  try {
    const localData = JSON.parse(localStorage.getItem("offline_popup_leads") || "[]");
    data = data.concat(localData);
  } catch (e) {}

  // Deduplicate by ID
  const seen = new Set();
  const unique = data.filter((item) => {
    if (!item.id) return true;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return unique.sort((a, b) => {
    const timeA = a.updatedAt?.seconds || a.timestamp?.seconds || a.createdAt?.seconds || 0;
    const timeB = b.updatedAt?.seconds || b.timestamp?.seconds || b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
};

/**
 * Updates lead status or admin notes
 */
export const updatePopupLeadStatus = async (id, updateData) => {
  try {
    if (!id.startsWith("offline_")) {
      const docRef = doc(db, "popup_leads", id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    }
  } catch (error) {
    console.warn("Firestore update failed, fallback to local storage:", error);
  }

  try {
    const localData = JSON.parse(localStorage.getItem("offline_popup_leads") || "[]");
    const updated = localData.map((item) => (item.id === id ? { ...item, ...updateData } : item));
    localStorage.setItem("offline_popup_leads", JSON.stringify(updated));
    return { success: true, isOffline: true };
  } catch (e) {
    console.error("Failed to update popup lead locally:", e);
    throw e;
  }
};

/**
 * Deletes a popup lead by ID
 */
export const deletePopupLead = async (id) => {
  try {
    if (!id.startsWith("offline_")) {
      await deleteDoc(doc(db, "popup_leads", id));
    }
  } catch (err) {
    console.warn("Firestore delete failed, removing from local storage:", err);
  }

  try {
    const local = JSON.parse(localStorage.getItem("offline_popup_leads") || "[]");
    const filtered = local.filter((item) => item.id !== id);
    localStorage.setItem("offline_popup_leads", JSON.stringify(filtered));
    return { success: true };
  } catch (e) {
    console.error("Failed to delete popup lead locally:", e);
  }
};

/**
 * Saves AI easy Ayi registration data to Firestore with multi-tier fallback
 */
export const saveAiEasyAyiRegistration = async (formData) => {
  const sanitize = (str, max = 500) => String(str || "").replace(/[<>]/g, "").trim().slice(0, max);
  const cleanPhone = String(formData.phone || "").replace(/\D/g, "").slice(-10);

  const payload = {
    fullName: sanitize(formData.fullName || formData.name, 100),
    name: sanitize(formData.fullName || formData.name, 100),
    phone: cleanPhone,
    address: sanitize(formData.address, 250),
    place: sanitize(formData.place || formData.city || formData.location, 100),
    city: sanitize(formData.place || formData.city || formData.location, 100),
    location: sanitize(formData.place || formData.city || formData.location, 100),
    education: sanitize(formData.education, 100),
    program: "AI easy Ayi",
    type: "AI_EASY_AYI",
    isAiEasyAyi: true,
    isAiForEveryone: true,
    originalPrice: Number(formData.originalPrice || 899),
    amount: Number(formData.amount || 99),
    amountPaid: Number(formData.amountPaid || 0),
    paymentStatus: sanitize(formData.paymentStatus || "unpaid", 20),
    paymentId: sanitize(formData.paymentId || "", 100),
    status: sanitize(formData.status || (formData.paymentStatus === "paid" ? "Paid & Confirmed" : "Unpaid Lead"), 50),
    adminNotes: sanitize(formData.adminNotes || "", 500),
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    // Primary attempt: Save to ai_for_everyone_registrations
    const docRef = await addDoc(collection(db, "ai_for_everyone_registrations"), payload);
    return { success: true, id: docRef.id, collection: "ai_for_everyone_registrations" };
  } catch (error) {
    console.warn("Primary save to ai_for_everyone_registrations failed, attempting popup_leads fallback:", error);
    try {
      // Fallback Tier 1: popup_leads
      const fallbackRef = await addDoc(collection(db, "popup_leads"), {
        ...payload,
        leadSource: "AI easy Ayi Form",
        purpose: "AI easy Ayi Registration",
        completed: true,
      });
      return { success: true, id: fallbackRef.id, collection: "popup_leads" };
    } catch (fallbackError) {
      console.warn("popup_leads fallback failed, attempting event_registrations fallback:", fallbackError);
      try {
        // Fallback Tier 2: event_registrations
        const eventRef = await addDoc(collection(db, "event_registrations"), {
          name: payload.fullName,
          fullName: payload.fullName,
          phone: payload.phone,
          address: payload.address,
          place: payload.place,
          education: payload.education,
          program: "AI easy Ayi",
          type: "EVENT_ENTRY",
          isAiEasyAyi: true,
          isAiForEveryone: true,
          status: "New",
          timestamp: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
        return { success: true, id: eventRef.id, collection: "event_registrations" };
      } catch (eventError) {
        console.error("All Firestore saves failed for AI easy Ayi registration, saving locally:", eventError);
        try {
          const localData = JSON.parse(localStorage.getItem("offline_ai_easy_ayi_registrations") || localStorage.getItem("offline_ai_for_everyone_registrations") || "[]");
          const offlineId = `offline_ayi_${Date.now()}`;
          localData.unshift({
            ...payload,
            id: offlineId,
            timestamp: { seconds: Math.floor(Date.now() / 1000) },
            createdAt: { seconds: Math.floor(Date.now() / 1000) },
            updatedAt: { seconds: Math.floor(Date.now() / 1000) },
            isOffline: true,
          });
          localStorage.setItem("offline_ai_easy_ayi_registrations", JSON.stringify(localData.slice(0, 100)));
          return { success: true, id: offlineId, isOffline: true };
        } catch (localErr) {
          console.error("LocalStorage fallback failed:", localErr);
        }
        throw error;
      }
    }
  }
};
export const saveAiForEveryoneRegistration = saveAiEasyAyiRegistration;

/**
 * Fetches all AI easy Ayi registrations across collections and offline storage
 */
export const getAiEasyAyiRegistrations = async () => {
  let data = [];
  try {
    const [mainSnapshot, popupSnapshot, leadsSnapshot, eventSnapshot] = await Promise.allSettled([
      getDocs(collection(db, "ai_for_everyone_registrations")),
      getDocs(collection(db, "popup_leads")),
      getDocs(collection(db, "aptitude_test_leads")),
      getDocs(collection(db, "event_registrations")),
    ]);

    if (mainSnapshot.status === "fulfilled" && mainSnapshot.value) {
      const mainList = mainSnapshot.value.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        _collection: "ai_for_everyone_registrations",
      }));
      data = data.concat(mainList);
    }

    if (popupSnapshot.status === "fulfilled" && popupSnapshot.value) {
      const popupList = popupSnapshot.value.docs
        .map((d) => ({ id: d.id, ...d.data(), _collection: "popup_leads" }))
        .filter(
          (item) =>
            item.type === "AI_FOR_EVERYONE" ||
            item.type === "AI_EASY_AYI" ||
            item.isAiForEveryone === true ||
            item.isAiEasyAyi === true ||
            item.program === "AI For Everyone" ||
            item.program === "AI easy Ayi"
        );
      data = data.concat(popupList);
    }

    if (leadsSnapshot.status === "fulfilled" && leadsSnapshot.value) {
      const leadsList = leadsSnapshot.value.docs
        .map((d) => ({ id: d.id, ...d.data(), _collection: "aptitude_test_leads" }))
        .filter(
          (item) =>
            item.type === "AI_FOR_EVERYONE" ||
            item.type === "AI_EASY_AYI" ||
            item.isAiForEveryone === true ||
            item.isAiEasyAyi === true ||
            item.program === "AI For Everyone" ||
            item.program === "AI easy Ayi"
        );
      data = data.concat(leadsList);
    }

    if (eventSnapshot.status === "fulfilled" && eventSnapshot.value) {
      const eventList = eventSnapshot.value.docs
        .map((d) => ({ id: d.id, ...d.data(), _collection: "event_registrations" }))
        .filter(
          (item) =>
            item.isAiForEveryone === true ||
            item.isAiEasyAyi === true ||
            item.program === "AI For Everyone" ||
            item.program === "AI easy Ayi" ||
            item.type === "AI_FOR_EVERYONE" ||
            item.type === "AI_EASY_AYI"
        );
      data = data.concat(eventList);
    }
  } catch (error) {
    console.error("Error fetching AI easy Ayi registrations:", error);
  }

  // Merge offline entries if any
  try {
    const localData = JSON.parse(
      localStorage.getItem("offline_ai_easy_ayi_registrations") ||
      localStorage.getItem("offline_ai_for_everyone_registrations") ||
      "[]"
    );
    data = data.concat(localData);
  } catch (e) {}

  // Sort first: paid entries first, then by most recent timestamp
  data.sort((a, b) => {
    const aPaid = (a.paymentStatus === "paid" || Boolean(a.paymentId)) ? 1 : 0;
    const bPaid = (b.paymentStatus === "paid" || Boolean(b.paymentId)) ? 1 : 0;
    if (aPaid !== bPaid) return bPaid - aPaid;
    const timeA = a.updatedAt?.seconds || a.timestamp?.seconds || a.createdAt?.seconds || 0;
    const timeB = b.updatedAt?.seconds || b.timestamp?.seconds || b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

  // Deduplicate by ID and unique phone
  const seenIds = new Set();
  const seenPhones = new Set();
  const unique = [];

  for (const item of data) {
    if (item.id && seenIds.has(item.id)) continue;
    if (item.id) seenIds.add(item.id);

    const normPhone = normalizePhone(item.phone);
    if (normPhone && seenPhones.has(normPhone)) continue;
    if (normPhone) seenPhones.add(normPhone);

    unique.push(item);
  }

  return unique.sort((a, b) => {
    const timeA = a.updatedAt?.seconds || a.timestamp?.seconds || a.createdAt?.seconds || 0;
    const timeB = b.updatedAt?.seconds || b.timestamp?.seconds || b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
};
export const getAiForEveryoneRegistrations = getAiEasyAyiRegistrations;

/**
 * Updates status or admin notes for an AI easy Ayi registration
 */
export const updateAiEasyAyiRegistration = async (id, updateData) => {
  const sanitize = (str, max = 500) => String(str || "").replace(/[<>]/g, "").trim().slice(0, max);
  const payload = {
    updatedAt: serverTimestamp(),
  };
  if (updateData.status !== undefined) payload.status = sanitize(updateData.status, 50);
  if (updateData.paymentStatus !== undefined) payload.paymentStatus = sanitize(updateData.paymentStatus, 50);
  if (updateData.paymentId !== undefined) payload.paymentId = sanitize(updateData.paymentId, 100);
  if (updateData.amountPaid !== undefined) payload.amountPaid = Number(updateData.amountPaid);
  if (updateData.adminNotes !== undefined) payload.adminNotes = sanitize(updateData.adminNotes, 500);

  if (!id.startsWith("offline_")) {
    const candidateCollections = [
      "ai_for_everyone_registrations",
      "popup_leads",
      "aptitude_test_leads",
      "event_registrations",
    ];
    for (const col of candidateCollections) {
      try {
        await updateDoc(doc(db, col, id), payload);
        break;
      } catch (err) {
        // Continue to other collections
      }
    }
  }

  try {
    const local = JSON.parse(
      localStorage.getItem("offline_ai_easy_ayi_registrations") ||
      localStorage.getItem("offline_ai_for_everyone_registrations") ||
      "[]"
    );
    const updatedLocal = local.map((item) =>
      item.id === id
        ? { ...item, ...payload, updatedAt: { seconds: Math.floor(Date.now() / 1000) } }
        : item
    );
    localStorage.setItem("offline_ai_easy_ayi_registrations", JSON.stringify(updatedLocal));
  } catch (err) {
    console.error("Local update failed:", err);
  }

  return { success: true };
};
export const updateAiForEveryoneRegistration = updateAiEasyAyiRegistration;

/**
 * Deletes an AI easy Ayi registration across collections and local storage
 */
export const deleteAiEasyAyiRegistration = async (id) => {
  if (!id.startsWith("offline_")) {
    const candidateCollections = [
      "ai_for_everyone_registrations",
      "popup_leads",
      "aptitude_test_leads",
      "event_registrations",
    ];
    for (const col of candidateCollections) {
      try {
        await deleteDoc(doc(db, col, id));
      } catch (err) {
        // Continue to other collections
      }
    }
  }

  try {
    const local = JSON.parse(
      localStorage.getItem("offline_ai_easy_ayi_registrations") ||
      localStorage.getItem("offline_ai_for_everyone_registrations") ||
      "[]"
    );
    const filtered = local.filter((item) => item.id !== id);
    localStorage.setItem("offline_ai_easy_ayi_registrations", JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete local entry:", e);
  }

  return { success: true };
};
export const deleteAiForEveryoneRegistration = deleteAiEasyAyiRegistration;

/**
 * Saves AI Booster Program registration data to Firestore with multi-tier fallback
 */
export const saveAiBoosterProgramRegistration = async (formData) => {
  const sanitize = (str, max = 500) => String(str || "").replace(/[<>]/g, "").trim().slice(0, max);
  const cleanPhone = String(formData.phone || "").replace(/\D/g, "").slice(-10);

  const payload = {
    fullName: sanitize(formData.fullName || formData.name, 100),
    name: sanitize(formData.fullName || formData.name, 100),
    phone: cleanPhone,
    place: sanitize(formData.place || formData.city || formData.location, 100),
    collegeOrSchool: sanitize(formData.collegeOrSchool || formData.institution || formData.schoolOrCollege, 150),
    institution: sanitize(formData.collegeOrSchool || formData.institution || formData.schoolOrCollege, 150),
    yearOrSem: sanitize(formData.yearOrSem || formData.year || formData.sem, 100),
    interestedInAi: sanitize(formData.interestedInAi || "Yes", 100),
    program: "AI Booster Program",
    type: "AI_BOOSTER_PROGRAM",
    isAiBoosterProgram: true,
    isAiForStudents: true,
    status: sanitize(formData.status || "New Registration", 50),
    paymentStatus: sanitize(formData.paymentStatus || "unpaid", 50),
    paymentId: sanitize(formData.paymentId || "", 100),
    amountPaid: formData.amountPaid !== undefined ? Number(formData.amountPaid) : 0,
    originalPrice: formData.originalPrice !== undefined ? Number(formData.originalPrice) : 599,
    offerPrice: 49,
    adminNotes: sanitize(formData.adminNotes || "", 500),
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    // Primary attempt: Save to dedicated collection ai_booster_program_registrations
    const docRef = await addDoc(collection(db, "ai_booster_program_registrations"), payload);
    return { success: true, id: docRef.id, collection: "ai_booster_program_registrations" };
  } catch (error) {
    console.warn("Primary save to ai_booster_program_registrations failed, attempting ai_for_students_registrations fallback:", error);
    try {
      const stuRef = await addDoc(collection(db, "ai_for_students_registrations"), payload);
      return { success: true, id: stuRef.id, collection: "ai_for_students_registrations" };
    } catch (stuError) {
      console.warn("ai_for_students_registrations failed, attempting popup_leads fallback:", stuError);
      try {
        // Fallback Tier 2: popup_leads
        const fallbackRef = await addDoc(collection(db, "popup_leads"), {
          ...payload,
          leadSource: "AI Booster Program Form",
          purpose: "AI Booster Program Registration",
          completed: true,
        });
        return { success: true, id: fallbackRef.id, collection: "popup_leads" };
      } catch (fallbackError) {
        console.warn("popup_leads fallback failed, attempting event_registrations fallback:", fallbackError);
        try {
          // Fallback Tier 3: event_registrations
          const eventRef = await addDoc(collection(db, "event_registrations"), {
            name: payload.fullName,
            fullName: payload.fullName,
            phone: payload.phone,
            place: payload.place,
            institution: payload.collegeOrSchool,
            collegeOrSchool: payload.collegeOrSchool,
            yearOrSem: payload.yearOrSem,
            interestedInAi: payload.interestedInAi,
            program: "AI Booster Program",
            type: "EVENT_ENTRY",
            isAiBoosterProgram: true,
            isAiForStudents: true,
            status: "New Registration",
            timestamp: serverTimestamp(),
            createdAt: serverTimestamp(),
          });
          return { success: true, id: eventRef.id, collection: "event_registrations" };
        } catch (eventError) {
          console.error("All Firestore saves failed for AI Booster Program registration, saving locally:", eventError);
          try {
            const localData = JSON.parse(
              localStorage.getItem("offline_ai_booster_program_registrations") ||
              localStorage.getItem("offline_ai_for_students_registrations") ||
              "[]"
            );
            const offlineId = `offline_booster_${Date.now()}`;
            localData.unshift({
              ...payload,
              id: offlineId,
              timestamp: { seconds: Math.floor(Date.now() / 1000) },
              createdAt: { seconds: Math.floor(Date.now() / 1000) },
              updatedAt: { seconds: Math.floor(Date.now() / 1000) },
              isOffline: true,
            });
            localStorage.setItem("offline_ai_booster_program_registrations", JSON.stringify(localData.slice(0, 100)));
            localStorage.setItem("offline_ai_for_students_registrations", JSON.stringify(localData.slice(0, 100)));
            return { success: true, id: offlineId, isOffline: true };
          } catch (localErr) {
            console.error("LocalStorage fallback failed:", localErr);
          }
          throw error;
        }
      }
    }
  }
};
export const saveAiForStudentsRegistration = saveAiBoosterProgramRegistration;

/**
 * Fetches all AI Booster Program registrations across collections and offline storage
 */
export const getAiBoosterProgramRegistrations = async () => {
  let data = [];
  try {
    const [boosterSnapshot, stuSnapshot, popupSnapshot, eventSnapshot] = await Promise.allSettled([
      getDocs(collection(db, "ai_booster_program_registrations")),
      getDocs(collection(db, "ai_for_students_registrations")),
      getDocs(collection(db, "popup_leads")),
      getDocs(collection(db, "event_registrations")),
    ]);

    if (boosterSnapshot.status === "fulfilled" && boosterSnapshot.value) {
      const boosterList = boosterSnapshot.value.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        _collection: "ai_booster_program_registrations",
      }));
      data = data.concat(boosterList);
    }

    if (stuSnapshot.status === "fulfilled" && stuSnapshot.value) {
      const stuList = stuSnapshot.value.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        _collection: "ai_for_students_registrations",
      }));
      data = data.concat(stuList);
    }

    if (popupSnapshot.status === "fulfilled" && popupSnapshot.value) {
      const popupList = popupSnapshot.value.docs
        .map((d) => ({ id: d.id, ...d.data(), _collection: "popup_leads" }))
        .filter(
          (item) =>
            item.type === "AI_BOOSTER_PROGRAM" ||
            item.type === "AI_FOR_STUDENTS" ||
            item.isAiBoosterProgram === true ||
            item.isAiForStudents === true ||
            item.program === "AI Booster Program" ||
            item.program === "AI for Students"
        );
      data = data.concat(popupList);
    }

    if (eventSnapshot.status === "fulfilled" && eventSnapshot.value) {
      const eventList = eventSnapshot.value.docs
        .map((d) => ({ id: d.id, ...d.data(), _collection: "event_registrations" }))
        .filter(
          (item) =>
            item.isAiBoosterProgram === true ||
            item.isAiForStudents === true ||
            item.program === "AI Booster Program" ||
            item.program === "AI for Students" ||
            item.type === "AI_BOOSTER_PROGRAM" ||
            item.type === "AI_FOR_STUDENTS"
        );
      data = data.concat(eventList);
    }
  } catch (error) {
    console.error("Error fetching AI Booster Program registrations:", error);
  }

  // Merge offline entries if any
  try {
    const localData = JSON.parse(
      localStorage.getItem("offline_ai_booster_program_registrations") ||
      localStorage.getItem("offline_ai_for_students_registrations") ||
      "[]"
    );
    data = data.concat(localData);
  } catch (e) {}

  // Deduplicate strictly by ID
  const seenIds = new Set();
  const unique = [];

  for (const item of data) {
    if (item.id && seenIds.has(item.id)) continue;
    if (item.id) seenIds.add(item.id);
    unique.push(item);
  }

  return unique.sort((a, b) => {
    const timeA = a.updatedAt?.seconds || a.timestamp?.seconds || a.createdAt?.seconds || 0;
    const timeB = b.updatedAt?.seconds || b.timestamp?.seconds || b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
};
export const getAiForStudentsRegistrations = getAiBoosterProgramRegistrations;

/**
 * Updates status or admin notes for an AI Booster Program registration
 */
export const updateAiBoosterProgramRegistration = async (id, updateData) => {
  const sanitize = (str, max = 500) => String(str || "").replace(/[<>]/g, "").trim().slice(0, max);
  const payload = {
    updatedAt: serverTimestamp(),
  };
  if (updateData.status !== undefined) payload.status = sanitize(updateData.status, 50);
  if (updateData.adminNotes !== undefined) payload.adminNotes = sanitize(updateData.adminNotes, 500);
  if (updateData.paymentStatus !== undefined) payload.paymentStatus = sanitize(updateData.paymentStatus, 50);
  if (updateData.paymentId !== undefined) payload.paymentId = sanitize(updateData.paymentId, 100);
  if (updateData.amountPaid !== undefined) payload.amountPaid = Number(updateData.amountPaid);
  if (updateData.originalPrice !== undefined) payload.originalPrice = Number(updateData.originalPrice);
  if (updateData.offerPrice !== undefined) payload.offerPrice = Number(updateData.offerPrice);

  if (!id.startsWith("offline_")) {
    const candidateCollections = [
      "ai_booster_program_registrations",
      "ai_for_students_registrations",
      "popup_leads",
      "event_registrations",
    ];
    for (const col of candidateCollections) {
      try {
        await updateDoc(doc(db, col, id), payload);
        break;
      } catch (err) {
        // Continue to other collections
      }
    }
  }

  try {
    const localKeys = ["offline_ai_booster_program_registrations", "offline_ai_for_students_registrations"];
    localKeys.forEach((key) => {
      const local = JSON.parse(localStorage.getItem(key) || "[]");
      const updatedLocal = local.map((item) =>
        item.id === id
          ? { ...item, ...payload, updatedAt: { seconds: Math.floor(Date.now() / 1000) } }
          : item
      );
      localStorage.setItem(key, JSON.stringify(updatedLocal));
    });
  } catch (err) {
    console.error("Local update failed:", err);
  }

  return { success: true };
};
export const updateAiForStudentsRegistration = updateAiBoosterProgramRegistration;

/**
 * Deletes an AI Booster Program registration across collections and local storage
 */
export const deleteAiBoosterProgramRegistration = async (id) => {
  if (!id.startsWith("offline_")) {
    const candidateCollections = [
      "ai_booster_program_registrations",
      "ai_for_students_registrations",
      "popup_leads",
      "event_registrations",
    ];
    for (const col of candidateCollections) {
      try {
        await deleteDoc(doc(db, col, id));
      } catch (err) {
        // Continue to other collections
      }
    }
  }

  try {
    const localKeys = ["offline_ai_booster_program_registrations", "offline_ai_for_students_registrations"];
    localKeys.forEach((key) => {
      const local = JSON.parse(localStorage.getItem(key) || "[]");
      const filtered = local.filter((item) => item.id !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
    });
  } catch (e) {
    console.error("Failed to delete local booster entry:", e);
  }

  return { success: true };
};
export const deleteAiForStudentsRegistration = deleteAiBoosterProgramRegistration;



