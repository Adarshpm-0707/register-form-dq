import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION_NAME = "promo_codes";
const LOCAL_STORAGE_KEY = "deepstaq_promo_codes_cache";

// Initial seed codes if none exist yet
export const DEFAULT_PROMO_CODES = [
  {
    id: "default_easy50",
    code: "EASY50",
    discountType: "fixed", // 'fixed' (₹) or 'percentage' (%)
    discountValue: 50,
    description: "Flat ₹50 OFF for AI Easy Ayi Live Masterclass",
    applicableTo: "AI easy Ayi",
    isActive: true,
    maxUses: 500,
    usedCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "default_save20",
    code: "SAVE20",
    discountType: "fixed",
    discountValue: 20,
    description: "Special ₹20 OFF on registration",
    applicableTo: "AI easy Ayi",
    isActive: true,
    maxUses: 1000,
    usedCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "default_ai100",
    code: "FREE100",
    discountType: "percentage",
    discountValue: 100,
    description: "100% Full Scholarship / Free Entry",
    applicableTo: "AI easy Ayi",
    isActive: true,
    maxUses: 50,
    usedCount: 0,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Get cached local promo codes
 */
const getLocalPromoCodes = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Failed to load local promo codes:", e);
  }
  return DEFAULT_PROMO_CODES;
};

/**
 * Save promo codes to local cache
 */
const saveLocalPromoCodes = (codes) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(codes));
  } catch (e) {
    console.warn("Failed to cache promo codes locally:", e);
  }
};

/**
 * Fetch all promo codes (Firestore with local fallback)
 */
export const getPromoCodes = async () => {
  let list = [];
  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    if (!snap.empty) {
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      saveLocalPromoCodes(list);
      return list;
    }
  } catch (err) {
    console.warn("Firestore promo_codes fetch failed, using local cache:", err);
  }

  // If firestore returned empty or failed, use local/default
  const localList = getLocalPromoCodes();
  return localList;
};

/**
 * Add a new promo code
 */
export const createPromoCode = async (promoData) => {
  const cleanCode = String(promoData.code || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");

  if (!cleanCode) {
    throw new Error("Promo code string is required");
  }

  const payload = {
    code: cleanCode,
    discountType: promoData.discountType === "percentage" ? "percentage" : "fixed",
    discountValue: Number(promoData.discountValue) || 0,
    description: String(promoData.description || "").trim(),
    applicableTo: String(promoData.applicableTo || "AI easy Ayi").trim(),
    isActive: promoData.isActive !== false,
    maxUses: Number(promoData.maxUses) || 0, // 0 = unlimited
    usedCount: 0,
    expiryDate: promoData.expiryDate || null,
    createdAt: serverTimestamp(),
  };

  let createdId = `promo_${Date.now()}`;
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
    createdId = docRef.id;
  } catch (err) {
    console.warn("Failed to save promo code to Firestore, saving to local cache:", err);
  }

  // Update local cache
  const localList = getLocalPromoCodes();
  const newEntry = {
    id: createdId,
    ...payload,
    createdAt: new Date().toISOString(),
  };
  const updatedList = [newEntry, ...localList.filter((c) => c.code !== cleanCode)];
  saveLocalPromoCodes(updatedList);

  return { success: true, id: createdId, promo: newEntry };
};

/**
 * Update an existing promo code
 */
export const updatePromoCode = async (id, updateData) => {
  const payload = {
    ...updateData,
    updatedAt: serverTimestamp(),
  };

  if (payload.code) {
    payload.code = String(payload.code).trim().toUpperCase();
  }
  if (payload.discountValue !== undefined) {
    payload.discountValue = Number(payload.discountValue);
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, payload);
  } catch (err) {
    console.warn("Firestore updateDoc promo code failed, updating locally:", err);
  }

  // Update local cache
  const localList = getLocalPromoCodes();
  const updatedList = localList.map((item) =>
    item.id === id ? { ...item, ...updateData, updatedAt: new Date().toISOString() } : item
  );
  saveLocalPromoCodes(updatedList);

  return { success: true };
};

/**
 * Delete a promo code
 */
export const deletePromoCode = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (err) {
    console.warn("Firestore deleteDoc promo code failed, deleting locally:", err);
  }

  // Update local cache
  const localList = getLocalPromoCodes();
  const filtered = localList.filter((item) => item.id !== id);
  saveLocalPromoCodes(filtered);

  return { success: true };
};

/**
 * Validate and calculate discount for a promo code
 * @param {string} inputCode
 * @param {number} originalAmount (e.g. 99)
 * @param {string} program
 */
export const validatePromoCode = async (inputCode, originalAmount = 99, program = "AI easy Ayi") => {
  const clean = String(inputCode || "").trim().toUpperCase();
  if (!clean) {
    return { valid: false, message: "Please enter a promo code" };
  }

  const allCodes = await getPromoCodes();
  const match = allCodes.find((c) => String(c.code).toUpperCase() === clean);

  if (!match) {
    return { valid: false, message: "Invalid promo code. Please check and try again." };
  }

  if (match.isActive === false) {
    return { valid: false, message: "This promo code is currently inactive or expired." };
  }

  if (match.expiryDate) {
    const exp = new Date(match.expiryDate).getTime();
    if (Date.now() > exp) {
      return { valid: false, message: "This promo code has expired." };
    }
  }

  if (match.maxUses && match.maxUses > 0 && (match.usedCount || 0) >= match.maxUses) {
    return { valid: false, message: "This promo code has reached its maximum usage limit." };
  }

  // Calculate discount
  let discountAmount = 0;
  if (match.discountType === "percentage") {
    const pct = Math.min(100, Math.max(0, Number(match.discountValue) || 0));
    discountAmount = Math.round((originalAmount * pct) / 100);
  } else {
    // Fixed amount
    discountAmount = Math.min(originalAmount, Math.max(0, Number(match.discountValue) || 0));
  }

  const finalAmount = Math.max(0, originalAmount - discountAmount);

  return {
    valid: true,
    code: match.code,
    discountType: match.discountType,
    discountValue: match.discountValue,
    discountAmount,
    finalAmount,
    description: match.description || `${match.discountType === "percentage" ? `${match.discountValue}%` : `₹${match.discountValue}`} discount applied`,
    message: `Promo code applied successfully! ₹${discountAmount} discount.`,
  };
};
