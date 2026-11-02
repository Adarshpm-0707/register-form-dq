import React, { useState, useEffect } from "react";
import {
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} from "../../services/promoService";

const PromoCodesAdminSection = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form State
  const [formState, setFormState] = useState({
    code: "",
    discountType: "fixed", // 'fixed' or 'percentage'
    discountValue: 50,
    applicableTo: "AI easy Ayi",
    description: "",
    maxUses: 0,
    expiryDate: "",
    isActive: true,
  });

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const data = await getPromoCodes();
      setPromoCodes(data || []);
    } catch (e) {
      console.error("Error fetching promo codes:", e);
      showNotification("error", "Failed to fetch promo codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingPromo(null);
    setFormState({
      code: "",
      discountType: "fixed",
      discountValue: 50,
      applicableTo: "AI easy Ayi",
      description: "Special discount for AI Easy Ayi registration",
      maxUses: 0,
      expiryDate: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (promo) => {
    setEditingPromo(promo);
    setFormState({
      code: promo.code || "",
      discountType: promo.discountType || "fixed",
      discountValue: promo.discountValue || 0,
      applicableTo: promo.applicableTo || "AI easy Ayi",
      description: promo.description || "",
      maxUses: promo.maxUses || 0,
      expiryDate: promo.expiryDate || "",
      isActive: promo.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromo(null);
  };

  const handleToggleStatus = async (promo) => {
    const updatedStatus = !(promo.isActive !== false);
    try {
      await updatePromoCode(promo.id, { isActive: updatedStatus });
      setPromoCodes((prev) =>
        prev.map((item) => (item.id === promo.id ? { ...item, isActive: updatedStatus } : item))
      );
      showNotification("success", `Promo code ${promo.code} ${updatedStatus ? "activated" : "deactivated"}`);
    } catch (e) {
      console.error(e);
      showNotification("error", "Failed to update promo status");
    }
  };

  const handleDelete = async (promo) => {
    if (!window.confirm(`Are you sure you want to delete promo code "${promo.code}"?`)) {
      return;
    }
    try {
      await deletePromoCode(promo.id);
      setPromoCodes((prev) => prev.filter((item) => item.id !== promo.id));
      showNotification("success", `Promo code ${promo.code} deleted successfully`);
    } catch (e) {
      console.error(e);
      showNotification("error", "Failed to delete promo code");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.code.trim()) {
      alert("Please enter a valid promo code string.");
      return;
    }

    setSaving(true);
    try {
      if (editingPromo) {
        await updatePromoCode(editingPromo.id, {
          code: formState.code.trim().toUpperCase(),
          discountType: formState.discountType,
          discountValue: Number(formState.discountValue),
          applicableTo: formState.applicableTo,
          description: formState.description,
          maxUses: Number(formState.maxUses),
          expiryDate: formState.expiryDate || null,
          isActive: formState.isActive,
        });
        setPromoCodes((prev) =>
          prev.map((item) =>
            item.id === editingPromo.id
              ? {
                  ...item,
                  code: formState.code.trim().toUpperCase(),
                  discountType: formState.discountType,
                  discountValue: Number(formState.discountValue),
                  applicableTo: formState.applicableTo,
                  description: formState.description,
                  maxUses: Number(formState.maxUses),
                  expiryDate: formState.expiryDate || null,
                  isActive: formState.isActive,
                }
              : item
          )
        );
        showNotification("success", `Promo code ${formState.code} updated successfully!`);
      } else {
        const res = await createPromoCode(formState);
        setPromoCodes((prev) => [res.promo, ...prev]);
        showNotification("success", `Promo code ${formState.code} created successfully!`);
      }
      handleCloseModal();
    } catch (e) {
      console.error(e);
      showNotification("error", e.message || "Failed to save promo code");
    } finally {
      setSaving(false);
    }
  };

  const filteredCodes = promoCodes.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.code?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.applicableTo?.toLowerCase().includes(q)
    );
  });

  const activeCount = promoCodes.filter((c) => c.isActive !== false).length;
  const inactiveCount = promoCodes.length - activeCount;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-2 shadow-sm ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800"
              : "bg-red-500/10 border-red-500/30 text-red-800"
          }`}
        >
          <span className="truncate">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-mono font-bold uppercase underline shrink-0 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border-2 border-[#050521] shadow-[4px_4px_0px_0px_#050521] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fa0058] animate-pulse shrink-0" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#fa0058]">
              Marketing & Discount Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#050521] tracking-tight uppercase leading-tight">
            Promo & Discount Codes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
            Create coupon codes to offer flat or percentage discounts on AI Easy Ayi registration.
            Discounts are automatically reflected in Razorpay checkout!
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-[#050521] hover:bg-[#fa0058] text-white font-black uppercase text-xs tracking-wider transition-all shadow-[4px_4px_0px_0px_#c6ff34] active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer text-center"
        >
          <span className="text-lg leading-none font-bold">+</span>
          <span>Add New Promo Code</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white border-2 border-[#050521] rounded-2xl p-3.5 sm:p-5 shadow-[3px_3px_0px_0px_#050521] flex flex-col justify-between">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1 truncate">
            Total Promo Codes
          </span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#050521] font-mono truncate">
            {promoCodes.length}
          </span>
        </div>

        <div className="bg-white border-2 border-emerald-500 rounded-2xl p-3.5 sm:p-5 shadow-[3px_3px_0px_0px_#10b981] flex flex-col justify-between">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1 truncate">
            Active Codes
          </span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-600 font-mono truncate">
            {activeCount}
          </span>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-3.5 sm:p-5 shadow-[3px_3px_0px_0px_#94a3b8] flex flex-col justify-between">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1 truncate">
            Inactive Codes
          </span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-600 font-mono truncate">
            {inactiveCount}
          </span>
        </div>

        <div className="bg-white border-2 border-[#fa0058] rounded-2xl p-3.5 sm:p-5 shadow-[3px_3px_0px_0px_#fa0058] flex flex-col justify-between">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#fa0058] block mb-1 truncate">
            Target Program
          </span>
          <span className="text-xs sm:text-sm md:text-base font-black text-[#050521] block truncate" title="AI Easy Ayi (₹99)">
            AI Easy Ayi (₹99)
          </span>
        </div>
      </div>

      {/* Search & Info Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="relative w-full sm:w-80 md:w-96">
          <input
            type="text"
            placeholder="Search promo codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">🔍</span>
        </div>
        <div className="text-[11px] sm:text-xs font-mono font-bold text-slate-600 text-left sm:text-right">
          Showing {filteredCodes.length} of {promoCodes.length} codes
        </div>
      </div>

      {/* Promo Codes Cards / Table */}
      {loading ? (
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 text-center">
          <div className="w-8 h-8 border-4 border-[#050521] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Loading promo codes...
          </p>
        </div>
      ) : filteredCodes.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 text-center">
          <span className="text-3xl block mb-2">🏷️</span>
          <h4 className="text-base font-black uppercase text-[#050521]">No Promo Codes Found</h4>
          <p className="text-xs text-slate-500 mt-1">
            Click "+ Add New Promo Code" above to create your first discount code.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredCodes.map((promo) => {
            const isActive = promo.isActive !== false;
            const discountLabel =
              promo.discountType === "percentage"
                ? `${promo.discountValue}% OFF`
                : `₹${promo.discountValue} OFF`;

            // Calculate sample discounted rate from ₹99
            const sampleDiscount =
              promo.discountType === "percentage"
                ? Math.round((99 * (promo.discountValue || 0)) / 100)
                : Math.min(99, promo.discountValue || 0);
            const samplePayable = Math.max(0, 99 - sampleDiscount);

            return (
              <div
                key={promo.id}
                className={`bg-white border-2 ${
                  isActive
                    ? "border-[#050521] shadow-[3px_3px_0px_0px_#050521] sm:shadow-[4px_4px_0px_0px_#050521]"
                    : "border-slate-300 shadow-[2px_2px_0px_0px_#cbd5e1] opacity-75"
                } rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3.5 sm:gap-4 transition-all hover:-translate-y-0.5`}
              >
                <div>
                  {/* Top Bar with Badge & Active Switch */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 min-w-0">
                    <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-[#050521] text-[#c6ff34] font-mono text-xs sm:text-sm font-black tracking-widest uppercase shadow-sm truncate max-w-[65%]">
                      {promo.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(promo)}
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-200 text-slate-700 border border-slate-300"
                      }`}
                    >
                      {isActive ? "● Active" : "○ Inactive"}
                    </button>
                  </div>

                  {/* Discount Offer Callout */}
                  <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-lg sm:text-xl font-black text-[#fa0058] tracking-tight truncate">
                        {discountLabel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-bold shrink-0">
                        {promo.applicableTo || "AI easy Ayi"}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-600 flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-slate-200/60">
                      <span>Rate on ₹99:</span>
                      <span className="font-bold text-emerald-700">
                        {samplePayable === 0 ? "FREE (₹0)" : `₹${samplePayable}`} (Save ₹{sampleDiscount})
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 break-words">
                    {promo.description || "No description provided"}
                  </p>

                  {/* Constraints */}
                  <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 text-[10px] font-mono text-slate-500">
                    {promo.maxUses && promo.maxUses > 0 ? (
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                        Max: {promo.maxUses}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                        Unlimited
                      </span>
                    )}

                    {promo.expiryDate && (
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 truncate max-w-full">
                        Expires: {promo.expiryDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(promo)}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(promo)}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal (Fully Responsive on Mobile & Laptop) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col max-h-[92vh] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between shrink-0 bg-white">
              <div className="pr-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">
                  {editingPromo ? "Edit Promo Code" : "Create New Promo Code"}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {editingPromo ? `Update ${editingPromo.code}` : "New Discount Code"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Configure discount code rules and deductions for registrations.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer text-base font-bold shrink-0"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <form id="promoForm" onSubmit={handleFormSubmit} className="space-y-4">
                {/* Promo Code Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Promo Code (Uppercase) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EASY50, WELCOME20, FREE100"
                    value={formState.code}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold tracking-wide placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Only letters, numbers, and dashes. Converted to uppercase automatically.
                  </p>
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Discount Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formState.discountType}
                      onChange={(e) =>
                        setFormState({ ...formState, discountType: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                    >
                      <option value="fixed">Fixed Amount (₹ Flat OFF)</option>
                      <option value="percentage">Percentage (% OFF)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {formState.discountType === "percentage" ? "Percentage (% OFF)" : "Discount Value (₹)"} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={formState.discountType === "percentage" ? "100" : "99"}
                      required
                      value={formState.discountValue}
                      onChange={(e) =>
                        setFormState({ ...formState, discountValue: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-600 font-medium">
                    Rate on ₹99:
                  </span>
                  <span className="font-bold text-emerald-700 font-mono text-xs sm:text-sm">
                    {formState.discountType === "percentage"
                      ? formState.discountValue >= 100
                        ? "100% OFF (FREE ₹0)"
                        : `₹${Math.max(0, 99 - Math.round((99 * (Number(formState.discountValue) || 0)) / 100))} (Saved ₹${Math.round((99 * (Number(formState.discountValue) || 0)) / 100)})`
                      : `₹${Math.max(0, 99 - (Number(formState.discountValue) || 0))} (Saved ₹${Number(formState.discountValue) || 0})`}
                  </span>
                </div>

                {/* Applicable Program */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Applicable Program
                  </label>
                  <input
                    type="text"
                    value={formState.applicableTo}
                    onChange={(e) =>
                      setFormState({ ...formState, applicableTo: e.target.value })
                    }
                    placeholder="AI easy Ayi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Description / Note
                  </label>
                  <textarea
                    rows={2}
                    value={formState.description}
                    onChange={(e) =>
                      setFormState({ ...formState, description: e.target.value })
                    }
                    placeholder="e.g. Flat ₹50 discount for AI Easy Ayi registration"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                  />
                </div>

                {/* Max Uses & Expiry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Max Uses (0 = Unlimited)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formState.maxUses}
                      onChange={(e) =>
                        setFormState({ ...formState, maxUses: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formState.expiryDate}
                      onChange={(e) =>
                        setFormState({ ...formState, expiryDate: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={formState.isActive}
                    onChange={(e) =>
                      setFormState({ ...formState, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                  />
                  <label
                    htmlFor="isActiveToggle"
                    className="text-xs font-medium text-slate-800 select-none cursor-pointer"
                  >
                    Promo code is Active & ready to use immediately
                  </label>
                </div>
              </form>
            </div>

            {/* Modal Footer - Fixed at bottom */}
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/70 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="promoForm"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 text-center"
              >
                {saving ? "Saving..." : editingPromo ? "Update Code" : "Save Code"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodesAdminSection;
