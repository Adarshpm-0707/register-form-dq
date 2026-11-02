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

// No automatic or default codes - ONLY codes added by Admin in the database exist
export const DEFAULT_PROMO_CODES = [];

/**
 * Get cached local promo codes (strictly purging any legacy test codes)
 */
const getLocalPromoCodes = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Cleanse cache: remove any legacy test sample codes
        const clean = parsed.filter(
          (item) =>
            item &&
            !String(item.id || "").startsWith("default_") &&
            !["EASY50", "SAVE20", "FREE100"].includes(item.code)
        );
        return clean;
      }
    }
  } catch (e) {
    console.warn("Failed to load local promo codes:", e);
  }
  return [];
};

/**
 * Save promo codes to local cache
 */
const saveLocalPromoCodes = (codes) => {
  try {
    const clean = Array.isArray(codes)
      ? codes.filter(
          (item) =>
            item &&
            !String(item.id || "").startsWith("default_") &&
            !["EASY50", "SAVE20", "FREE100"].includes(item.code)
        )
      : [];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clean));
  } catch (e) {
    console.warn("Failed to cache promo codes locally:", e);
  }
};

/**
 * Fetch all promo codes from Firestore database (only admin-added codes)
 */
export const getPromoCodes = async () => {
  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    const list = [];

    for (const d of snap.docs) {
      const data = d.data() || {};

      // Completely purge legacy test/sample codes from Firestore if found
      if (
        String(d.id).startsWith("default_") ||
        ["EASY50", "SAVE20", "FREE100"].includes(data.code)
      ) {
        deleteDoc(doc(db, COLLECTION_NAME, d.id)).catch(() => {});
        continue;
      }

      let createdAt = data.createdAt;
      if (createdAt && typeof createdAt.toDate === "function") {
        createdAt = createdAt.toDate().toISOString();
      } else if (typeof createdAt !== "string") {
        createdAt = new Date().toISOString();
      }

      list.push({
        id: d.id,
        ...data,
        createdAt,
      });
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    // Update local cache with live database records
    saveLocalPromoCodes(list);
    return list;
  } catch (err) {
    console.warn("Firestore promo_codes fetch failed, falling back to clean local cache:", err);
    return getLocalPromoCodes();
  }
};

/**
 * Add a new promo code directly to the Firestore database
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

  // Save to Firestore database
  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
  const createdId = docRef.id;

  const newEntry = {
    id: createdId,
    ...payload,
    createdAt: new Date().toISOString(),
  };

  // Update local cache
  const localList = getLocalPromoCodes();
  const updatedList = [newEntry, ...localList.filter((c) => c.id !== createdId && c.code !== cleanCode)];
  saveLocalPromoCodes(updatedList);

  return { success: true, id: createdId, promo: newEntry };
};

/**
 * Update an existing promo code in the database
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

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, payload);

  // Update local cache
  const localList = getLocalPromoCodes();
  const updatedList = localList.map((item) =>
    item.id === id ? { ...item, ...updateData, updatedAt: new Date().toISOString() } : item
  );
  saveLocalPromoCodes(updatedList);

  return { success: true };
};

/**
 * Delete a promo code from the database
 */
export const deletePromoCode = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);

  // Update local cache
  const localList = getLocalPromoCodes();
  const filtered = localList.filter((item) => item.id !== id);
  saveLocalPromoCodes(filtered);

  return { success: true };
};

/**
 * Validate and calculate discount for a promo code against active database codes
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
    return { valid: false, message: "This promo code is currently inactive." };
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
