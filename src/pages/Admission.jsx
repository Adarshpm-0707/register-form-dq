import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveAdmissionRegistration } from "../services/dbService";
import { jsPDF } from "jspdf";
import emailjs from "@emailjs/browser";
import logo from "../assets/logo.png";

function Admission() {
  const [formData, setFormData] = useState({
    // 1. Student Details
    fullName: "",
    gender: "",
    dob: "",

    // 2. Contact Details
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",

    // 3. Parent Details
    fatherName: "",
    fatherOccupation: "",
    fatherPhone: "",
    motherName: "",
    motherOccupation: "",
    motherPhone: "",

    // 4. Educational Qualification
    highestQualification: "",
    institutionName: "",
    boardUniversity: "",
    passingYear: "",
    percentageCGPA: "",
    courseMode: "",
    amount: "30000",

    // 6. Documents Checklist
    submittedDocuments: {
      aadhaar: false,
      photo: false,
      sslc: false,
      plusTwo: false,
      degree: false,
    },

    // 7. Emergency Contact
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",

    // 9. Referral Source
    heardAboutUs: {
      instagram: false,
      facebook: false,
      youtube: false,
      google: false,
      friendsFamily: false,
      newspaper: false,
      event: false,
      other: false,
    },
    heardAboutUsOther: "",
  });

  const [files, setFiles] = useState({
    photo: null,
    allDocsPdf: null,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [step, setStep] = useState(1); // 1: Personal & Contact, 2: Parents & Education, 3: Documents & Source
  const [payId, setPayId] = useState("");

  const handleTextChange = (e, section, key) => {
    const value = e.target.value;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleCheckboxChange = (section, key) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: !prev[section][key] }
    }));
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate format
    if (docType === "photo") {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Invalid format! Please upload a JPEG, PNG, or WebP image for your Passport Size Photo.");
        e.target.value = "";
        return;
      }
    } else if (docType === "allDocsPdf") {
      if (file.type !== "application/pdf") {
        alert("Invalid format! Only PDF files are allowed for consolidated documents.");
        e.target.value = "";
        return;
      }
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large! Maximum size allowed is 5MB.");
      e.target.value = "";
      return;
    }

    setFiles(prev => ({ ...prev, [docType]: file }));
  };

  const removeFile = (docType) => {
    setFiles(prev => ({ ...prev, [docType]: null }));
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.fullName.trim()) return "Full Name is required.";
      if (!formData.gender) return "Gender selection is required.";
      if (!formData.dob) return "Date of Birth is required.";
      if (!formData.phone.trim() || formData.phone.replace(/\D/g, "").length < 10) return "Valid 10-digit mobile number is required.";
      if (!formData.email.trim() || !formData.email.includes("@")) return "Valid email ID is required.";
      if (!formData.address.trim()) return "Current Address is required.";
      if (!formData.city.trim()) return "City is required.";
      if (!formData.district.trim()) return "District is required.";
      if (!formData.state.trim()) return "State is required.";
      if (!formData.pinCode.trim() || formData.pinCode.replace(/\D/g, "").length < 6) return "Valid 6-digit PIN code is required.";
    } else if (currentStep === 2) {
      // Parents Details validation is optional but if fields are added they should be correct
      if (formData.fatherPhone && formData.fatherPhone.replace(/\D/g, "").length < 10) return "Father's mobile number must be 10 digits.";
      if (formData.motherPhone && formData.motherPhone.replace(/\D/g, "").length < 10) return "Mother's mobile number must be 10 digits.";

      // Course Mode is required
      if (!formData.courseMode) return "Please select Course Mode (Offline or Online).";
    } else if (currentStep === 3) {
      // Check emergency contact
      if (!formData.emergencyName.trim()) return "Emergency contact name is required.";
      if (!formData.emergencyRelationship.trim()) return "Relationship status is required.";
      if (!formData.emergencyPhone.trim() || formData.emergencyPhone.replace(/\D/g, "").length < 10) return "Valid 10-digit emergency phone number is required.";

      // Check payment amount
      if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
        return "Please enter a valid payment amount.";
      }

      // Check if Passport Size Photo is uploaded
      if (!files.photo) {
        return "Passport Size Photo is required to be uploaded.";
      }

      // Check if All Documents PDF is uploaded
      if (!files.allDocsPdf) {
        return "All Documents PDF file is required to be uploaded.";
      }
    }
    return null;
  };

  const handleNext = () => {
    const errorMsg = validateStep(step);
    if (errorMsg) {
      setStatus({ type: "error", message: errorMsg });
      setTimeout(() => setStatus({ type: "", message: "" }), 4000);
      return;
    }
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateStep(3);
    if (errorMsg) {
      setStatus({ type: "error", message: errorMsg });
      return;
    }

    setLoading(true);
    setStatus({ type: "info", message: "Initializing payment gateway..." });

    try {
      const isScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!isScriptLoaded) {
        setStatus({ type: "error", message: "Failed to load Razorpay SDK. Please check your internet connection." });
        setLoading(false);
        return;
      }

      const paymentAmount = Number(formData.amount);
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_L9X7H7N9F9m1z2",
        amount: Math.round(paymentAmount * 100), // convert to paise
        currency: "INR",
        name: "DeepStaq Academy",
        description: "AI/ML Diploma Program Admission Fee",
        image: "/favicon.ico",
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#050521"
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStatus({ type: "info", message: "Payment cancelled by user." });
          }
        },
        handler: async function (response) {
          try {
            setLoading(true);
            setStatus({ type: "info", message: "Payment successful. Saving registration details..." });

            const payIdVal = response.razorpay_payment_id;
            const dataToSave = {
              ...formData,
              paymentId: payIdVal,
              paymentStatus: "Paid",
              paymentChannel: "Razorpay (Success)"
            };

            await saveAdmissionRegistration(dataToSave, files);
            setPayId(payIdVal);
            sendSuccessEmail(payIdVal);
            setStatus({ type: "success", message: "Admission Form and Payment Completed Successfully!" });
            setStep(4);
          } catch (err) {
            console.error("Failed to save registration after payment:", err);
            setStatus({ type: "error", message: "Payment successful, but failed to save details: " + err.message });
          } finally {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment setup failed:", error);
      setStatus({ type: "error", message: error.message || "Failed to initiate payment." });
      setLoading(false);
    }
  };

  const buildReceiptPDF = (refId) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // 1. Draw a sleek accent top bar
    doc.setFillColor(198, 255, 52); // #c6ff34 (Neon Green)
    doc.rect(0, 0, 210, 6, "F");

    // Brand Logo Image (Square PNG)
    try {
      doc.addImage(logo, "PNG", 20, 15, 16, 16);
    } catch (e) {
      // Fallback text if logo rendering fails
      doc.setTextColor(5, 5, 33);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("DEEPSTAQ", 20, 26);
    }

    // Receipt info top right (aligned with logo vertical bounds 15 to 31)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(5, 5, 33);
    doc.text("ADMISSION RECEIPT", 190, 18, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 130);
    doc.text(`Reference: ${refId}`, 190, 24, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 190, 30, { align: "right" });

    // Divider line
    doc.setDrawColor(230, 230, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 37, 190, 37);

    // 3. Receipt Status Banner
    doc.setFillColor(242, 252, 225); // very light neon-green background
    doc.roundedRect(20, 45, 170, 14, 2, 2, "F");

    // Status Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(92, 148, 13); // dark green
    doc.text("STATUS: REGISTRATION RECEIVED & CONFIRMED", 25, 54);

    // 4. Details Container Card
    doc.setDrawColor(220, 222, 230);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 67, 170, 100, 3, 3, "D");

    // Card Header
    doc.setFillColor(248, 249, 252);
    doc.roundedRect(20.5, 67.5, 169, 12, 3, 3, "F");
    doc.rect(20.5, 73.5, 169, 6.5, "F"); // keep header bottom edges square

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 110);
    doc.text("REGISTRATION DETAILS", 26, 75.5);

    // Grid Layout of fields inside the Card
    const fields = [
      { label: "Full Name", value: formData.fullName },
      { label: "Email Address", value: formData.email },
      { label: "Mobile Number", value: formData.phone },
      { label: "Selected Course", value: "AI/ML Diploma Program" },
      { label: "Course Mode", value: formData.courseMode ? formData.courseMode.toUpperCase() : "OFFLINE" },
      { label: "Admission Ref ID", value: refId },
      { label: "Amount Paid", value: `${Number(formData.amount).toLocaleString("en-IN")} (INR)` },
      { label: "Payment Channel", value: "Razorpay (Success)" }
    ];

    let fieldY = 90;
    fields.forEach((field, index) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(110, 112, 125);
      doc.text(field.label, 26, fieldY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(5, 5, 33);
      doc.text(String(field.value), 72, fieldY);

      if (index < fields.length - 1) {
        doc.setDrawColor(240, 241, 245);
        doc.setLineWidth(0.3);
        doc.line(26, fieldY + 4, 184, fieldY + 4);
      }
      fieldY += 10;
    });

    // 5. Onboarding / Thank you message box
    doc.setFillColor(250, 250, 252);
    doc.setDrawColor(230, 232, 240);
    doc.roundedRect(20, 176, 170, 48, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(5, 5, 33);
    doc.text("WHAT'S NEXT?", 26, 186);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 115);
    const message = "Your enrollment form is successfully recorded in our synchronization database. Over the next 24-48 hours, our academic coordinator will review your document uploads, activate your student dashboard credentials, and share batch synchronization timetables via email and WhatsApp. Welcome to the cohort!";

    const wrappedMessage = doc.splitTextToSize(message, 158);
    doc.text(wrappedMessage, 26, 192);

    // 6. Security Seal / Onboarding Note
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 150);
    doc.text("This receipt is automatically generated upon submission. No physical signature is required.", 20, 240);

    // Footer
    doc.setDrawColor(230, 230, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 260, 190, 260);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 150);
    doc.text("DEEPSTAQ ACADEMY • DIVE DEEP INTO AI", 20, 269);
    doc.text("deepstackbyaleef@gmail.com  •  +91 94959 57011", 190, 269, { align: "right" });

    return doc;
  };

  const sendSuccessEmail = async (refId) => {
    try {
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "bFDZOBC1470xibY7t";
      emailjs.init(publicKey);

      const templateParams = {
        to_name: formData.fullName,
        to_email: formData.email,
        email: formData.email,
        reply_to: formData.email,
        reference_id: refId,
        course: "AI/ML Diploma Program",
        amount: `₹${Number(formData.amount).toLocaleString("en-IN")}`,
        payment_method: "Online",
      };

      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_pkth2jp",
        process.env.REACT_APP_EMAILJS_ADMISSION_TEMPLATE_ID || "admission_success",
        templateParams,
        publicKey
      );
      console.log("Admission success email sent successfully to", formData.email);
    } catch (error) {
      console.error("Failed to send admission confirmation email:", error.text || error);
      alert("Email sending failed! Error details: " + (error.text || JSON.stringify(error)));
    }
  };

  const generateReceiptPDF = () => {
    const doc = buildReceiptPDF(payId);
    doc.save(`DeepStaq_Admission_Receipt_${formData.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      gender: "",
      dob: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      fatherName: "",
      fatherOccupation: "",
      fatherPhone: "",
      motherName: "",
      motherOccupation: "",
      motherPhone: "",
      highestQualification: "",
      institutionName: "",
      boardUniversity: "",
      passingYear: "",
      percentageCGPA: "",
      courseMode: "",
      submittedDocuments: {
        aadhaar: false,
        photo: false,
        sslc: false,
        plusTwo: false,
        degree: false,
      },
      emergencyName: "",
      emergencyRelationship: "",
      emergencyPhone: "",
      heardAboutUs: {
        instagram: false,
        facebook: false,
        youtube: false,
        google: false,
        friendsFamily: false,
        newspaper: false,
        event: false,
        other: false,
      },
      heardAboutUsOther: "",
    });
    setFiles({
      aadhaar: null,
      photo: null,
      sslc: null,
      plusTwo: null,
      degree: null,
    });
    setStep(1);
    setStatus({ type: "", message: "" });
    setPayId("");
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 md:px-8 overflow-x-hidden bg-[#f8f9fa] text-[#050521]">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#c6ff34]/20 to-transparent blur-3xl opacity-40 mix-blend-multiply" />
        <div className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#c6ff34]/15 to-[#050521]/5 blur-3xl opacity-50 mix-blend-multiply" />
      </div>

      <div className="w-full max-w-4xl mx-auto">

        {/* Banner Headers */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#050521] text-[#c6ff34] rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-4 border border-[#c6ff34]/20 shadow-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse"></span>
            Enrollment Gateway
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[#050521] mb-2"
          >
            Student Admission <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-[#c6ff34]">Form</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#050521]/60 text-sm font-bold uppercase tracking-widest"
          >
            Apply Online for Admission Check-In
          </motion.p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-6 md:p-12 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.06)] relative overflow-hidden"
        >
          {/* Stepper Progress */}
          {step <= 3 && (
            <div className="flex justify-between items-center mb-10 pb-8 border-b border-[#050521]/5 relative">
              <div className="absolute top-[35%] left-0 right-0 h-0.5 bg-[#050521]/5 -z-10"></div>
              <div
                className="absolute top-[35%] left-0 h-0.5 bg-[#c6ff34] -z-10 transition-all duration-500"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>

              {[
                { s: 1, title: "Personal Details" },
                { s: 2, title: "Parents & Academics" },
                { s: 3, title: "Documents & Submit" }
              ].map((item) => (
                <div key={item.s} className="flex flex-col items-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${step >= item.s
                      ? "bg-[#050521] text-[#c6ff34] border-2 border-[#c6ff34] shadow-[0_0_15px_rgba(198,255,52,0.3)]"
                      : "bg-[#f8f9fa] text-[#050521]/30 border border-[#050521]/5"
                    }`}>
                    {item.s}
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider mt-2.5 hidden sm:block ${step >= item.s ? "text-[#050521]" : "text-[#050521]/30"
                    }`}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Feedback messages */}
          <AnimatePresence>
            {status.message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center border transition-all ${status.type === "error"
                    ? "bg-red-50 text-red-600 border-red-200"
                    : status.type === "success"
                      ? "bg-[#c6ff34]/20 text-[#050521] border-[#c6ff34]/30"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
              >
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* STEP 1: Personal & Contact Details */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* 1. STUDENT DETAILS */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-l-4 border-[#c6ff34] pl-3">
                    <span className="text-[#050521]/30 font-black text-xl">01</span>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#050521]">Student Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleTextChange(e, null, "fullName")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium shadow-sm"
                        placeholder="ENTER STUDENT NAME"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Gender *</label>
                        <select
                          required
                          value={formData.gender}
                          onChange={(e) => handleTextChange(e, null, "gender")}
                          className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-bold uppercase tracking-wider text-xs shadow-sm cursor-pointer"
                        >
                          <option value="">SELECT</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Date of Birth *</label>
                        <input
                          type="date"
                          required
                          value={formData.dob}
                          onChange={(e) => handleTextChange(e, null, "dob")}
                          className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-3.5 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium text-sm shadow-sm cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. CONTACT DETAILS */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-3 border-l-4 border-[#c6ff34] pl-3">
                    <span className="text-[#050521]/30 font-black text-xl">02</span>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#050521]">Contact Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Student Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength="10"
                        value={formData.phone}
                        onChange={(e) => handleTextChange(e, null, "phone")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium shadow-sm"
                        placeholder="10 DIGIT NUMBER"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Student Email ID *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleTextChange(e, null, "email")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium shadow-sm"
                        placeholder="STUDENT@EXAMPLE.COM"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Current Address *</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => handleTextChange(e, null, "address")}
                      className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium min-h-[100px] resize-none shadow-sm"
                      placeholder="ENTER HOUSE NAME, STREET DETAILS, ETC."
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => handleTextChange(e, null, "city")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-4 py-3.5 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium text-sm shadow-sm"
                        placeholder="CITY"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">District *</label>
                      <input
                        type="text"
                        required
                        value={formData.district}
                        onChange={(e) => handleTextChange(e, null, "district")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-4 py-3.5 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium text-sm shadow-sm"
                        placeholder="DISTRICT"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">State *</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => handleTextChange(e, null, "state")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-4 py-3.5 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium text-sm shadow-sm"
                        placeholder="STATE"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">PIN Code *</label>
                      <input
                        type="text"
                        required
                        maxLength="6"
                        value={formData.pinCode}
                        onChange={(e) => handleTextChange(e, null, "pinCode")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-4 py-3.5 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium text-sm shadow-sm"
                        placeholder="6 DIGIT PIN"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end pt-6 border-t border-[#050521]/5">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-10 py-4 rounded-2xl bg-[#050521] text-white hover:bg-[#c6ff34] hover:text-[#050521] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md cursor-pointer"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Parents & Academics Details */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* 3. PARENT / GUARDIAN DETAILS */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-l-4 border-[#c6ff34] pl-3">
                    <span className="text-[#050521]/30 font-black text-xl">03</span>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#050521]">Parent / Guardian Details</h2>
                  </div>

                  {/* Father Details */}
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-[#050521]/5 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#050521]/60">Father’s Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#050521]/50 ml-1">Father's Name</label>
                        <input
                          type="text"
                          value={formData.fatherName}
                          onChange={(e) => handleTextChange(e, null, "fatherName")}
                          className="w-full bg-white border border-[#050521]/5 rounded-xl px-4 py-3 outline-none focus:border-[#c6ff34] text-xs font-medium"
                          placeholder="FATHER'S NAME"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#050521]/50 ml-1">Occupation</label>
                        <input
                          type="text"
                          value={formData.fatherOccupation}
                          onChange={(e) => handleTextChange(e, null, "fatherOccupation")}
                          className="w-full bg-white border border-[#050521]/5 rounded-xl px-4 py-3 outline-none focus:border-[#c6ff34] text-xs font-medium"
                          placeholder="OCCUPATION"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#050521]/50 ml-1">Mobile Number</label>
                        <input
                          type="tel"
                          maxLength="10"
                          value={formData.fatherPhone}
                          onChange={(e) => handleTextChange(e, null, "fatherPhone")}
                          className="w-full bg-white border border-[#050521]/5 rounded-xl px-4 py-3 outline-none focus:border-[#c6ff34] text-xs font-medium"
                          placeholder="FATHER'S MOBILE"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mother Details */}
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-[#050521]/5 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#050521]/60">Mother’s Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#050521]/50 ml-1">Mother's Name</label>
                        <input
                          type="text"
                          value={formData.motherName}
                          onChange={(e) => handleTextChange(e, null, "motherName")}
                          className="w-full bg-white border border-[#050521]/5 rounded-xl px-4 py-3 outline-none focus:border-[#c6ff34] text-xs font-medium"
                          placeholder="MOTHER'S NAME"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#050521]/50 ml-1">Occupation</label>
                        <input
                          type="text"
                          value={formData.motherOccupation}
                          onChange={(e) => handleTextChange(e, null, "motherOccupation")}
                          className="w-full bg-white border border-[#050521]/5 rounded-xl px-4 py-3 outline-none focus:border-[#c6ff34] text-xs font-medium"
                          placeholder="OCCUPATION"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#050521]/50 ml-1">Mobile Number</label>
                        <input
                          type="tel"
                          maxLength="10"
                          value={formData.motherPhone}
                          onChange={(e) => handleTextChange(e, null, "motherPhone")}
                          className="w-full bg-white border border-[#050521]/5 rounded-xl px-4 py-3 outline-none focus:border-[#c6ff34] text-xs font-medium"
                          placeholder="MOTHER'S MOBILE"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. EDUCATIONAL QUALIFICATION */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-3 border-l-4 border-[#c6ff34] pl-3">
                    <span className="text-[#050521]/30 font-black text-xl">04</span>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#050521]">Educational Qualification</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Highest Qualification</label>
                      <select
                        value={formData.highestQualification}
                        onChange={(e) => handleTextChange(e, null, "highestQualification")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                      >
                        <option value="">SELECT LEVEL</option>
                        <option value="Degree">Bachelor Degree</option>
                        <option value="Plus Two">Plus Two / HSC</option>
                        <option value="PG">Post Graduate</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Course Name</label>
                      <input
                        type="text"
                        value={formData.institutionName}
                        onChange={(e) => handleTextChange(e, null, "institutionName")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] text-sm font-medium shadow-sm"
                        placeholder="NAME OF SCHOOL OR COLLEGE"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Board / University</label>
                      <input
                        type="text"
                        value={formData.boardUniversity}
                        onChange={(e) => handleTextChange(e, null, "boardUniversity")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] text-sm font-medium shadow-sm"
                        placeholder="E.G. CBSE, UNIVERSITY OF KERALA"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Year of Passing</label>
                      <input
                        type="number"
                        value={formData.passingYear}
                        onChange={(e) => handleTextChange(e, null, "passingYear")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] text-sm font-medium shadow-sm"
                        placeholder="YEAR"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Marks / Percentage / CGPA</label>
                      <input
                        type="text"
                        value={formData.percentageCGPA}
                        onChange={(e) => handleTextChange(e, null, "percentageCGPA")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] text-sm font-medium shadow-sm"
                        placeholder="E.G. 85% OR 9.2 CGPA"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Course Mode *</label>
                    <div className="flex gap-6 mt-1 ml-2">
                      <label className="inline-flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="courseMode"
                          value="Offline"
                          required
                          checked={formData.courseMode === "Offline"}
                          onChange={(e) => handleTextChange(e, null, "courseMode")}
                          className="w-4 h-4 text-[#050521] border-[#050521]/20 focus:ring-[#c6ff34] accent-[#050521]"
                        />
                        <span className="text-xs font-black uppercase tracking-wider text-[#050521]/80 group-hover:text-[#050521]">Offline Mode</span>
                      </label>

                      <label className="inline-flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="courseMode"
                          value="Online"
                          checked={formData.courseMode === "Online"}
                          onChange={(e) => handleTextChange(e, null, "courseMode")}
                          className="w-4 h-4 text-[#050521] border-[#050521]/20 focus:ring-[#c6ff34] accent-[#050521]"
                        />
                        <span className="text-xs font-black uppercase tracking-wider text-[#050521]/80 group-hover:text-[#050521]">Online Mode</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-[#050521]/5">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#050521] font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-10 py-4 rounded-2xl bg-[#050521] text-white hover:bg-[#c6ff34] hover:text-[#050521] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md cursor-pointer"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Documents, Referral & Submit */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* 6. DOCUMENTS SUBMITTED */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-l-4 border-[#c6ff34] pl-3">
                    <span className="text-[#050521]/30 font-black text-xl">06</span>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#050521]">Documents & Photo Upload</h2>
                  </div>
                  <p className="text-[10px] text-[#050521]/60 font-medium leading-relaxed bg-[#f8f9fa] p-4 rounded-2xl border border-[#050521]/5 ml-1">
                    Please upload your <strong>Passport Size Photo</strong> as an image, and combine all other certificates (Aadhaar, SSLC, Plus Two, and Degree) into <strong>a single PDF file</strong> for upload.
                  </p>

                  <div className="space-y-5">
                    {/* 1. Passport Size Photo Upload */}
                    <div className={`p-5 rounded-2xl border transition-all duration-300 ${files.photo ? "bg-[#c6ff34]/10 border-[#c6ff34]/50 shadow-sm" : "bg-white border-[#050521]/10 hover:border-[#c6ff34]/50"}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={!!files.photo}
                            readOnly
                            className="w-4 h-4 text-[#050521] border-[#050521]/20 focus:ring-[#c6ff34] accent-[#050521] mt-0.5"
                          />
                          <div>
                            <span className="text-xs font-black uppercase tracking-wider text-[#050521]">Passport Size Photo *</span>
                            <p className="text-[9px] text-[#050521]/40 font-bold uppercase tracking-widest mt-0.5">JPEG, PNG, or WebP image format</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {files.photo ? (
                            <div className="flex items-center gap-3.5">
                              <span className="text-[10px] font-bold text-blue-700 truncate max-w-[150px] md:max-w-[200px]">
                                {files.photo.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile("photo")}
                                className="p-2 bg-red-55 hover:bg-red-100 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors border border-red-200/50 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <label className="px-5 py-2.5 bg-slate-50 border border-[#050521]/10 rounded-xl text-[10px] font-black uppercase tracking-wider text-[#050521] hover:bg-[#050521] hover:text-white transition-all cursor-pointer inline-block">
                              Upload Photo
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => handleFileChange(e, "photo")}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2. All Documents in One PDF Upload */}
                    <div className={`p-5 rounded-2xl border transition-all duration-300 ${files.allDocsPdf ? "bg-[#c6ff34]/10 border-[#c6ff34]/50 shadow-sm" : "bg-white border-[#050521]/10 hover:border-[#c6ff34]/50"}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#050521]/5">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={!!files.allDocsPdf}
                            readOnly
                            className="w-4 h-4 text-[#050521] border-[#050521]/20 focus:ring-[#c6ff34] accent-[#050521] mt-0.5"
                          />
                          <div>
                            <span className="text-xs font-black uppercase tracking-wider text-[#050521]">All Documents in One PDF *</span>
                            <p className="text-[9px] text-[#050521]/40 font-bold uppercase tracking-widest mt-0.5">Single consolidated PDF file format</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {files.allDocsPdf ? (
                            <div className="flex items-center gap-3.5">
                              <span className="text-[10px] font-bold text-blue-700 truncate max-w-[150px] md:max-w-[200px]">
                                {files.allDocsPdf.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile("allDocsPdf")}
                                className="p-2 bg-red-55 hover:bg-red-100 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors border border-red-200/50 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <label className="px-5 py-2.5 bg-slate-50 border border-[#050521]/10 rounded-xl text-[10px] font-black uppercase tracking-wider text-[#050521] hover:bg-[#050521] hover:text-white transition-all cursor-pointer inline-block">
                              Upload PDF
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleFileChange(e, "allDocsPdf")}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Internal Checklist */}
                      <div className="pt-4 space-y-3.5">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#050521]/60 block ml-1">Check the documents included inside the PDF:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 ml-1">
                          {[
                            { key: "aadhaar", label: "Aadhaar Copy" },
                            { key: "sslc", label: "SSLC (10th) Certificate" },
                            { key: "plusTwo", label: "Plus Two (12th) Certificate" },
                            { key: "degree", label: "Degree Certificate (Optional)" }
                          ].map((doc) => (
                            <label key={doc.key} className="inline-flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={formData.submittedDocuments[doc.key]}
                                onChange={() => handleCheckboxChange("submittedDocuments", doc.key)}
                                className="w-4 h-4 text-[#050521] border-[#050521]/20 focus:ring-[#c6ff34] accent-[#050521]"
                              />
                              <span className="text-xs font-bold text-[#050521]/70 group-hover:text-[#050521]">{doc.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. EMERGENCY CONTACT */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-3 border-l-4 border-[#c6ff34] pl-3">
                    <span className="text-[#050521]/30 font-black text-xl">07</span>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#050521]">Emergency Contact</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.emergencyName}
                        onChange={(e) => handleTextChange(e, null, "emergencyName")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] text-sm font-medium shadow-sm"
                        placeholder="CONTACT PERSON"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Relationship *</label>
                      <input
                        type="text"
                        required
                        value={formData.emergencyRelationship}
                        onChange={(e) => handleTextChange(e, null, "emergencyRelationship")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] text-sm font-medium shadow-sm"
                        placeholder="E.G. BROTHER, UNCLE"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength="10"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleTextChange(e, null, "emergencyPhone")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] text-sm font-medium shadow-sm"
                        placeholder="10 DIGIT PHONE"
                      />
                    </div>
                  </div>
                </div>

                {/* 9. HOW DID YOU HEAR ABOUT US? */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-3 border-l-4 border-[#c6ff34] pl-3">
                    <span className="text-[#050521]/30 font-black text-xl">08x</span>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#050521]">How did you hear about us?</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ml-1">
                    {[
                      { key: "instagram", label: "Instagram" },
                      { key: "facebook", label: "Facebook" },
                      { key: "youtube", label: "YouTube" },
                      { key: "google", label: "Google Search" },
                      { key: "friendsFamily", label: "Friends/Family" },
                      { key: "newspaper", label: "Newspaper" },
                      { key: "event", label: "Seminar/Event" },
                      { key: "other", label: "Other" },
                    ].map((src) => (
                      <label key={src.key} className="inline-flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.heardAboutUs[src.key]}
                          onChange={() => handleCheckboxChange("heardAboutUs", src.key)}
                          className="w-4 h-4 text-[#050521] border-[#050521]/20 focus:ring-[#c6ff34] accent-[#050521]"
                        />
                        <span className="text-xs font-bold text-[#050521]/80 group-hover:text-[#050521]">{src.label}</span>
                      </label>
                    ))}
                  </div>

                  {formData.heardAboutUs.other && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex flex-col gap-2 pt-2"
                    >
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Specify other source</label>
                      <input
                        type="text"
                        value={formData.heardAboutUsOther}
                        onChange={(e) => handleTextChange(e, null, "heardAboutUsOther")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] text-sm font-medium shadow-sm"
                        placeholder="PLEASE WRITE DOWN THE DETAILS"
                      />
                    </motion.div>
                  )}
                </div>

                {/* 9. ADMISSION PAYMENT */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-3 border-l-4 border-[#c6ff34] pl-3">
                    <span className="text-[#050521]/30 font-black text-xl">09</span>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#050521]">Payment Amount</h2>
                  </div>
                  <p className="text-[10px] text-[#050521]/60 font-medium leading-relaxed bg-[#f8f9fa] p-4 rounded-2xl border border-[#050521]/5 ml-1">
                    Please enter the custom amount you wish to pay. This will initiate the Razorpay checkout portal for the specified amount.
                  </p>

                  <div className="max-w-xs flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Amount to Pay (INR) *</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#050521]/60">₹</span>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.amount}
                        onChange={(e) => handleTextChange(e, null, "amount")}
                        className="w-full bg-white border border-[#050521]/10 rounded-2xl pl-10 pr-5 py-4 outline-none focus:border-[#c6ff34] text-sm font-bold shadow-sm"
                        placeholder="ENTER AMOUNT"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation & Submit Buttons */}
                <div className="flex justify-between pt-6 border-t border-[#050521]/5">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={loading}
                    className="px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#050521] font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    Go Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-4 rounded-2xl bg-[#050521] text-white hover:bg-[#c6ff34] hover:text-[#050521] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md cursor-pointer disabled:opacity-80 flex items-center gap-3"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Form"
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Success Screen */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center gap-6"
              >
                <div className="w-20 h-20 rounded-full bg-[#c6ff34]/20 flex items-center justify-center border border-[#c6ff34] shadow-[0_0_30px_rgba(198,255,52,0.3)]">
                  <svg className="w-10 h-10 text-[#050521]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>

                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-[#050521] mb-2">Form Submitted Successfully!</h2>
                  <p className="text-sm font-bold text-[#050521]/60 max-w-md mx-auto leading-relaxed mb-4">
                    Thank you for applying. We have received your admission form along with your documents. Our team will verify them and contact you shortly.
                  </p>

                  {payId && (
                    <div className="inline-block bg-[#050521] text-white px-6 py-3 rounded-2xl border border-white/10 shadow-sm mt-2">
                      <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#c6ff34] block mb-1">Application Reference</span>
                      <strong className="font-mono text-xs uppercase tracking-widest">{payId}</strong>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={generateReceiptPDF}
                    className="px-8 py-4 rounded-2xl bg-[#c6ff34] text-[#050521] hover:bg-[#050521] hover:text-white font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md cursor-pointer border border-[#c6ff34] hover:border-[#050521]"
                  >
                    Download Receipt
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-4 rounded-2xl bg-[#050521] text-[#c6ff34] hover:bg-[#c6ff34] hover:text-[#050521] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md cursor-pointer"
                  >
                    Fill Another Form
                  </button>
                </div>
              </motion.div>
            )}

          </form>

        </motion.div>
      </div>
    </div>
  );
}

export default Admission;
