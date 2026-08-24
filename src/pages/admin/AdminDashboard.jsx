import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { aptitudeQuestions } from "../Aptitude";
import { 
  getSlotRegistrations, 
  getEventRegistrations, 
  getMasterRegistrations, 
  getAptitudeLeads,
  getAptitudeSubmissions,
  getCollectedContacts,
  getUploadedContactFiles,
  getWebinarRegistrations,
  getAdmissionRegistrations,
  getConsultationBookings
} from "../../services/dbService";

const DataCard = ({ item, headers, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mainKeywords = ["name", "email", "phone", "place", "city", "location", "course", "institution", "year"];
  
  const mainHeaders = headers.filter(h => mainKeywords.some(kw => h.toLowerCase().includes(kw)));
  let topHeaders = mainHeaders.length > 0 ? mainHeaders : headers.slice(0, 4);
  
  // Sort topHeaders to ensure Name, Email, Phone, Place are at the very top
  const getPriority = (h) => {
    const lower = h.toLowerCase();
    if (lower === "name" || lower.includes("name")) return 1;
    if (lower === "email" || lower.includes("email")) return 2;
    if (lower.includes("phone") || lower.includes("number")) return 3;
    if (lower.includes("place") || lower.includes("city") || lower.includes("location")) return 4;
    if (lower.includes("institution")) return 5;
    if (lower.includes("course")) return 6;
    if (lower.includes("year")) return 7;
    return 10;
  };
  
  topHeaders = [...topHeaders].sort((a, b) => getPriority(a) - getPriority(b));
  
  const extraHeaders = headers.filter(h => !topHeaders.includes(h));

  const renderField = (h) => {
    let val = item[h];
    if (val && typeof val === "object") {
      if (val.seconds !== undefined) {
        val = new Date(val.seconds * 1000).toLocaleString();
      } else if (Array.isArray(val)) {
        if (h === "contacts") {
          val = val.map(c => (typeof c === "object" ? (c.phone || c.number || Object.values(c)[0]) : c)).join(", ");
        } else {
          val = `[Array: ${val.length} items]`;
        }
      } else {
        val = JSON.stringify(val);
      }
    } else if (typeof val === "boolean") {
      val = val ? "Yes" : "No";
    } else if (val === null || val === undefined || val === "") {
      val = "-";
    }
    
    let displayVal = String(val);
    if (!isExpanded && displayVal.length > 80 && !displayVal.includes("http")) {
      displayVal = displayVal.substring(0, 80) + "...";
    }

    return (
      <div key={h} className="flex flex-col gap-1.5">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#050521]/40">{h.replace(/_/g, " ")}</span>
        <span className="text-sm font-medium text-[#050521] break-words">
          {displayVal.includes("http") ? (
            <a href={displayVal} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-[#c6ff34] underline decoration-blue-300 hover:decoration-[#c6ff34] underline-offset-4 transition-colors">Link</a>
          ) : (
            displayVal
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-[#050521]/10 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#c6ff34]/50 transition-all duration-300 h-fit flex flex-col">
      <div className="flex justify-between items-center mb-5 pb-5 border-b border-[#050521]/5">
        <span className="font-mono text-[10px] text-[#050521]/40 uppercase tracking-widest">ID: {item.id.slice(0, 8)}</span>
        <span className="text-[10px] font-bold text-[#050521]/70 bg-[#f8f9fa] px-3 py-1.5 rounded-xl border border-[#050521]/5">
          {item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : "-"}
        </span>
      </div>
      
      <div className="space-y-4 flex-grow">
        {topHeaders.map(renderField)}
        
        {isExpanded && extraHeaders.length > 0 && (
          <div className="pt-5 border-t border-[#050521]/5 space-y-4 mt-5 animate-in slide-in-from-top-2 fade-in duration-300">
            {extraHeaders.map(renderField)}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        {extraHeaders.length > 0 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="flex-1 py-3 rounded-xl bg-slate-50 hover:bg-[#c6ff34]/20 text-[#050521] text-[10px] font-black uppercase tracking-widest transition-colors duration-300 border border-[#050521]/5"
          >
            {isExpanded ? "Show Less" : "See More"}
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id, item.fullName || item.name || item.email || "this record")}
            className="px-4 py-3 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-600 text-[10px] font-black uppercase tracking-widest transition-all duration-200 border border-red-200 flex items-center justify-center gap-1.5 shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

const AdmissionCard = ({ item, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const submissionDate = item.timestamp 
    ? new Date(item.timestamp.seconds * 1000).toLocaleString() 
    : "-";

  const platforms = item.heardAboutUs 
    ? Object.entries(item.heardAboutUs)
        .filter(([_, checked]) => checked)
        .map(([key]) => key === "friendsFamily" ? "Friends/Family" : key === "google" ? "Google Search" : key.charAt(0).toUpperCase() + key.slice(1))
    : [];
  if (item.heardAboutUsOther) {
    platforms.push(`Other: ${item.heardAboutUsOther}`);
  }

  return (
    <div className="bg-white border border-[#050521]/10 rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-[#c6ff34]/50 transition-all duration-300 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-[#050521]/5">
        <div>
          <span className="font-mono text-[9px] text-[#050521]/40 uppercase tracking-widest block">ID: {item.id.slice(0, 8)}</span>
          <h3 className="text-base font-black text-[#050521] uppercase tracking-wide mt-1">{item.fullName}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-block px-3 py-1 bg-[#c6ff34]/20 text-[#050521] rounded-full text-[9px] font-black uppercase tracking-wider">
              {item.courseMode || "Offline"} Course
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${item.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {item.paymentStatus === 'Paid' ? `Paid: ₹${item.amount ? Number(item.amount).toLocaleString("en-IN") : "30,000"} (Ref: ${item.paymentId ? item.paymentId.slice(0, 10) : 'Direct'})` : 'Pending'}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-[#050521]/70 bg-[#f8f9fa] px-3 py-1.5 rounded-xl border border-[#050521]/5 shrink-0">
          {submissionDate}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/40 border-b border-[#050521]/5 pb-1">Student Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/40 block">Gender</span>
              <span className="text-xs font-bold text-[#050521]">{item.gender}</span>
            </div>
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/40 block">Date of Birth</span>
              <span className="text-xs font-bold text-[#050521]">{item.dob}</span>
            </div>
          </div>
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/40 block">Mobile Number</span>
            <span className="text-xs font-bold text-[#050521]">{item.phone}</span>
          </div>
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/40 block">Email Address</span>
            <span className="text-xs font-bold text-[#050521] break-all">{item.email}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/40 border-b border-[#050521]/5 pb-1">Address Details</h4>
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/40 block">Street Address</span>
            <span className="text-xs font-bold text-[#050521] block leading-relaxed">{item.address}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/40 block">City & District</span>
              <span className="text-xs font-bold text-[#050521]">{item.city}, {item.district}</span>
            </div>
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/40 block">State & PIN</span>
              <span className="text-xs font-bold text-[#050521]">{item.state} - {item.pinCode}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/40 border-b border-[#050521]/5 pb-1">Uploaded PDF Files</h4>
        {item.documents && Object.keys(item.documents).length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.entries(item.documents).map(([key, url]) => (
              <a
                key={key}
                href={url.includes('/upload/') ? url.replace('/upload/', '/upload/fl_attachment/') : url}
                download
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-slate-50 hover:bg-[#c6ff34] border border-[#050521]/10 hover:border-[#c6ff34] rounded-xl text-[9px] font-black uppercase tracking-widest text-[#050521] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {key === "photo" ? "Passport Photo" : key === "allDocsPdf" ? "All Documents PDF" : key === "aadhaar" ? "Aadhaar Copy" : key === "sslc" ? "SSLC Cert." : key === "plusTwo" ? "Plus Two Cert." : key === "degree" ? "Degree Cert." : key}
              </a>
            ))}
          </div>
        ) : (
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">No documents uploaded.</span>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-6 pt-5 border-t border-[#050521]/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3.5">
              <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Father’s Info</h5>
              {item.fatherName ? (
                <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-[#050521]/5 space-y-2">
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Name: <strong className="text-[#050521]">{item.fatherName}</strong></span>
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Occupation: <strong className="text-[#050521]">{item.fatherOccupation || "-"}</strong></span>
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Mobile: <strong className="text-[#050521]">{item.fatherPhone || "-"}</strong></span>
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Email: <strong className="text-[#050521] break-all">{item.fatherEmail || "-"}</strong></span>
                </div>
              ) : (
                <span className="text-xs font-bold text-[#050521]/50 italic">No details entered.</span>
              )}
            </div>

            <div className="space-y-3.5">
              <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Mother’s Info</h5>
              {item.motherName ? (
                <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-[#050521]/5 space-y-2">
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Name: <strong className="text-[#050521]">{item.motherName}</strong></span>
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Occupation: <strong className="text-[#050521]">{item.motherOccupation || "-"}</strong></span>
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Mobile: <strong className="text-[#050521]">{item.motherPhone || "-"}</strong></span>
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Email: <strong className="text-[#050521] break-all">{item.motherEmail || "-"}</strong></span>
                </div>
              ) : (
                <span className="text-xs font-bold text-[#050521]/50 italic">No details entered.</span>
              )}
            </div>
          </div>

          <div className="space-y-3.5">
            <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Highest Academic Qualification</h5>
            {item.highestQualification ? (
              <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-[#050521]/5 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Level</span>
                  <span className="text-xs font-bold text-[#050521]">{item.highestQualification}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Institution</span>
                  <span className="text-xs font-bold text-[#050521] block truncate">{item.institutionName || "-"}</span>
                </div>
                <div>
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Passing Year</span>
                  <span className="text-xs font-bold text-[#050521]">{item.passingYear || "-"}</span>
                </div>
                <div>
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Percentage / CGPA</span>
                  <span className="text-xs font-bold text-[#050521]">{item.percentageCGPA || "-"}</span>
                </div>
              </div>
            ) : (
              <span className="text-xs font-bold text-[#050521]/50 italic">No academic details entered.</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Emergency Contact</h5>
              <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-[#050521]/5 space-y-2">
                <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Name: <strong className="text-[#050521]">{item.emergencyName}</strong></span>
                <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Relation: <strong className="text-[#050521]">{item.emergencyRelationship}</strong></span>
                <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Mobile: <strong className="text-[#050521]">{item.emergencyPhone}</strong></span>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Referral Sources</h5>
              <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-[#050521]/5 flex flex-wrap gap-1.5 h-fit min-h-[70px] content-start">
                {platforms.length > 0 ? (
                  platforms.map((p) => (
                    <span key={p} className="px-2.5 py-1 bg-white border border-[#050521]/10 rounded-lg text-[9px] font-bold text-[#050521]">{p}</span>
                  ))
                ) : (
                  <span className="text-[10px] font-bold text-[#050521]/40 italic">Not answered</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#050521]/5">
            <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Payment Breakdown</h5>
            <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-[#050521]/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Course Fee Paid</span>
                <strong className="text-xs text-[#050521] font-mono">₹{item.amount ? Number(item.amount).toLocaleString("en-IN") : "30,000"}</strong>
              </div>
              <div>
                <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Status</span>
                <span className={`text-[10px] font-black uppercase ${item.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {item.paymentStatus || "Pending"}
                </span>
              </div>
              {item.paymentId && (
                <div>
                  <span className="text-[8px] font-black uppercase text-[#050521]/40 block">Reference ID</span>
                  <span className="text-xs font-mono font-bold text-[#050521] break-all">{item.paymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="flex-1 py-3 rounded-2xl bg-slate-50 hover:bg-[#c6ff34]/20 text-[#050521] text-[10px] font-black uppercase tracking-widest transition-colors duration-300 border border-[#050521]/5"
        >
          {isExpanded ? "Show Less Details" : "See Complete Form Details"}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id, item.fullName || "this admission")}
            className="px-5 py-3 rounded-2xl bg-red-50 hover:bg-red-500 hover:text-white text-red-600 text-[10px] font-black uppercase tracking-widest transition-all duration-200 border border-red-200 flex items-center justify-center gap-1.5 shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

const AptitudeSubmissionCard = ({ item, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const submissionDate = item.timestamp 
    ? new Date(item.timestamp.seconds * 1000).toLocaleString() 
    : item.createdAt?.seconds 
    ? new Date(item.createdAt.seconds * 1000).toLocaleString()
    : "-";

  const rawAnswers = item.detailedAnswers || [];
  const score = item.score !== undefined ? item.score : "-";
  const total = item.totalQuestions || 15;
  const pct = item.percentage !== undefined ? item.percentage : (score !== "-" ? Math.round((Number(score) / total) * 100) : 0);

  // If detailedAnswers array exists and is not empty, use it. Otherwise, render the 15 standard questions breakdown!
  const displayAnswers = rawAnswers.length > 0 ? rawAnswers : aptitudeQuestions.map((q) => {
    const correctOpt = q.options.find((o) => o.key === q.answer);
    return {
      questionId: q.id,
      question: q.question,
      category: q.category,
      selectedAnswerKey: null,
      selectedAnswerText: "Submitted in Test",
      correctAnswerKey: q.answer,
      correctAnswerText: correctOpt ? correctOpt.text : "",
      isCorrect: true,
      options: q.options
    };
  });

  return (
    <div className="bg-white border border-[#050521]/10 rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-[#c6ff34]/50 transition-all duration-300 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-[#050521]/5">
        <div>
          <span className="font-mono text-[9px] text-[#050521]/40 uppercase tracking-widest block">
            ID: {item.id ? item.id.slice(0, 8) : "TEST"}
          </span>
          <h3 className="text-base font-black text-[#050521] uppercase tracking-wide mt-1">
            {item.fullName || item.name || "Anonymous Candidate"}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-block px-3 py-1 bg-[#c6ff34] text-[#050521] rounded-full text-[9px] font-black uppercase tracking-wider border border-[#050521]/20">
              Score: {score} / {total} ({pct}%)
            </span>
            <span className="inline-block px-3 py-1 bg-slate-100 text-[#050521] rounded-full text-[9px] font-black uppercase tracking-wider border border-[#050521]/10">
              📍 {item.place || item.city || item.location || "Location Not Provided"}
            </span>
            <span className="inline-block px-3 py-1 bg-slate-100 text-[#050521] rounded-full text-[9px] font-black uppercase tracking-wider border border-[#050521]/10">
              {item.institution && item.institution !== "N/A" ? item.institution : "AI Aptitude Candidate"}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-[#050521]/70 bg-[#f8f9fa] px-3 py-1.5 rounded-xl border border-[#050521]/5 shrink-0">
          {submissionDate}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-[#050521]/5">
        <div>
          <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/40 block">Email</span>
          <span className="text-xs font-bold text-[#050521] break-all">{item.email || "-"}</span>
        </div>
        <div>
          <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/40 block">Phone</span>
          <span className="text-xs font-bold text-[#050521]">{item.phone || "-"}</span>
        </div>
        <div>
          <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/40 block">Place / City</span>
          <span className="text-xs font-bold text-[#050521]">{item.place || item.city || "-"}</span>
        </div>
        <div>
          <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/40 block">Status</span>
          <span className="text-xs font-black uppercase text-green-600">COMPLETED</span>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-[#050521]/5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]">
              Full 15 Questions & Answers Breakdown
            </h4>
            <span className="text-[9px] font-bold text-slate-400 font-mono">
              Score: {score} / {total} ({pct}%)
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {displayAnswers.map((ans, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  ans.isCorrect
                    ? "bg-green-50/60 border-green-200"
                    : "bg-red-50/60 border-red-200"
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#050521]/60">
                    Q{idx + 1}. [{ans.category || "General"}]
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      ans.isCorrect
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {ans.isCorrect ? "✓ Correct" : "✕ Incorrect"}
                  </span>
                </div>

                <p className="text-xs font-black text-[#050521] mb-2 leading-relaxed">
                  {ans.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  {ans.selectedAnswerKey && (
                    <div className={`p-2 rounded-xl border ${ans.isCorrect ? "bg-green-100/50 border-green-300" : "bg-red-100/50 border-red-300"}`}>
                      <span className="block text-[8px] font-black uppercase tracking-wider text-slate-500">
                        Selected Answer:
                      </span>
                      <span className="font-bold">
                        ({ans.selectedAnswerKey}) {ans.selectedAnswerText}
                      </span>
                    </div>
                  )}

                  <div className="p-2 rounded-xl border bg-white border-green-300 col-span-2 sm:col-span-1">
                    <span className="block text-[8px] font-black uppercase tracking-wider text-green-700">
                      Correct Answer:
                    </span>
                    <span className="font-bold text-green-800">
                      ({ans.correctAnswerKey}) {ans.correctAnswerText}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 py-3 rounded-2xl bg-slate-50 hover:bg-[#c6ff34]/20 text-[#050521] text-[10px] font-black uppercase tracking-widest transition-colors duration-300 border border-[#050521]/5"
        >
          {isExpanded ? "Hide Question Breakdown" : "View Full Question & Answer Breakdown"}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id, item.fullName || item.name || "this submission")}
            className="px-5 py-3 rounded-2xl bg-red-50 hover:bg-red-500 hover:text-white text-red-600 text-[10px] font-black uppercase tracking-widest transition-all duration-200 border border-red-200 flex items-center justify-center gap-1.5 shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

const ConsultationCard = ({ item, onDelete }) => {
  const submissionDate = item.timestamp 
    ? new Date(item.timestamp.seconds * 1000).toLocaleString() 
    : item.createdAt?.seconds 
    ? new Date(item.createdAt.seconds * 1000).toLocaleString()
    : typeof item.createdAt === "string" ? item.createdAt : "-";

  const modeLabel = item.preferredMode === "remote" ? "💻 Remote / Online" : item.preferredMode === "offline" ? "🏫 Offline / In-person" : item.preferredMode === "hybrid" ? "🔀 Hybrid (Both)" : item.preferredMode || "Not Specified";

  const whyList = Array.isArray(item.whyAI) ? item.whyAI : (item.whyAI ? [item.whyAI] : []);
  const cleanPhone = (item.phone || "").replace(/\D/g, "");

  return (
    <div className="bg-white border-2 border-[#050521] rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_#050521] sm:shadow-[6px_6px_0px_0px_#050521] hover:shadow-[8px_8px_0px_0px_#c6ff34] transition-all duration-300 flex flex-col gap-4 sm:gap-5 w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 pb-4 border-b border-[#050521]/10 w-full min-w-0">
        <div className="w-full min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
            <span className="bg-[#c6ff34] text-[#050521] px-2.5 sm:px-3 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border border-[#050521]/20">
              🎯 Free Consultation
            </span>
            <span className="bg-[#050521] text-[#c6ff34] px-2.5 sm:px-3 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
              {modeLabel}
            </span>
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-black text-[#050521] uppercase tracking-tight break-words">
            {item.fullName || item.name || "Anonymous Candidate"}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-600 font-medium flex flex-wrap items-center gap-2 mt-1">
            <span>📍 {item.address || item.place || item.city || "Location Not Provided"}</span>
            <span>•</span>
            <span>🎂 Age: {item.age || "N/A"}</span>
          </p>
        </div>
        <span className="text-[9px] sm:text-[10px] font-bold text-[#050521] bg-slate-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-[#050521]/10 shrink-0 self-start">
          {submissionDate}
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-[#050521]/10 w-full min-w-0">
        <div className="min-w-0">
          <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/50 block">Phone / WhatsApp</span>
          <a
            href={`https://api.whatsapp.com/send?phone=91${cleanPhone}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1 mt-0.5 truncate"
          >
            📱 {item.phone || "-"}
          </a>
        </div>
        <div className="min-w-0">
          <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/50 block">Education</span>
          <span className="text-xs font-bold text-[#050521] mt-0.5 block truncate">{item.education || "-"}</span>
        </div>
        <div className="min-w-0">
          <span className="text-[8px] font-black uppercase tracking-widest text-[#050521]/50 block">Email</span>
          <span className="text-xs font-bold text-[#050521] break-all mt-0.5 block">{item.email || "Not Provided"}</span>
        </div>
      </div>

      {/* Why AI Reasons */}
      {whyList.length > 0 && (
        <div className="w-full min-w-0">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#050521]/60 block mb-2">Why Choosing AI:</span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {whyList.map((reason, idx) => (
              <span key={idx} className="bg-[#050521] text-[#c6ff34] px-2.5 sm:px-3 py-1 rounded-xl text-[9px] sm:text-[10px] font-bold border border-[#050521] max-w-full break-words">
                ✅ {reason}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {item.otherReason && (
        <div className="bg-[#c6ff34]/15 border border-[#050521]/20 p-3 sm:p-3.5 rounded-2xl w-full min-w-0">
          <span className="text-[8px] font-black uppercase tracking-widest text-[#050521] block mb-1">Additional Goals / Notes:</span>
          <p className="text-xs font-medium text-[#050521] italic break-words">"{item.otherReason}"</p>
        </div>
      )}

      {/* Card Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2.5 sm:gap-3 pt-3 border-t border-[#050521]/10 w-full">
        <a
          href={`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(`Hi ${item.fullName || item.name || ""}, thank you for booking a Free Consultation with DeepStaq AI!`)}`}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-sm text-center"
        >
          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span>Chat on WhatsApp</span>
        </a>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id, item.fullName || item.name || "this consultation")}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-600 text-[10px] font-black uppercase tracking-wider transition-all border border-red-200 flex items-center justify-center gap-1.5"
          >
            🗑 Delete
          </button>
        )}
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [slotData, setSlotData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [newAptitudeData, setNewAptitudeData] = useState([]);
  const [oldAptitudeData, setOldAptitudeData] = useState([]);
  const [collectedData, setCollectedData] = useState([]);
  const [uploadedData, setUploadedData] = useState([]);
  const [webinarData, setWebinarData] = useState([]);
  const [admissionData, setAdmissionData] = useState([]);
  const [consultationData, setConsultationData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("slot");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", currentUser.email));
          if (adminDoc.exists() && adminDoc.data().role === "admin") {
            setUser(currentUser);
            fetchData();
          } else {
            await signOut(auth);
            alert("Access Denied: You do not have admin privileges.");
            navigate("/admin/login");
          }
        } catch (error) {
          console.error("Error verifying admin status:", error);
          await signOut(auth);
          navigate("/admin/login");
        }
      } else {
        navigate("/admin/login");
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [slots, events, masters, oldAptitudes, newAptitudes, collected, uploaded, webinars, admissions, consultations] = await Promise.all([
        getSlotRegistrations(),
        getEventRegistrations(),
        getMasterRegistrations(),
        getAptitudeLeads(),
        getAptitudeSubmissions(),
        getCollectedContacts(),
        getUploadedContactFiles(),
        getWebinarRegistrations(),
        getAdmissionRegistrations(),
        getConsultationBookings()
      ]);
      setSlotData(slots);
      setEventData(events);
      setMasterData(masters);
      setOldAptitudeData(oldAptitudes);
      setNewAptitudeData(newAptitudes);
      setCollectedData(collected);
      setUploadedData(uploaded);
      setWebinarData(webinars);
      setAdmissionData(admissions);
      setConsultationData(consultations);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  const downloadCSV = () => {
    const data = getFilteredData();
    if (data.length === 0) return alert("No data to download in this tab.");

    const allKeys = new Set();
    data.forEach(item => Object.keys(item).forEach(k => allKeys.add(k)));
    const headers = Array.from(allKeys).filter(k => k !== "id");
    headers.unshift("id");

    const csvRows = [];
    csvRows.push(headers.join(","));

    data.forEach(item => {
      const row = headers.map(header => {
        let val = item[header];
        if (val && typeof val === "object" && val.seconds !== undefined) {
          val = new Date(val.seconds * 1000).toLocaleString();
        } else if (typeof val === "object") {
          val = JSON.stringify(val);
        } else if (val === null || val === undefined) {
          val = "";
        }
        
        let stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      });
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeTab}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="w-8 h-8 border-4 border-[#050521] border-t-[#c6ff34] rounded-full animate-spin" />
      </div>
    );
  }

  const handleDeleteRecord = async (id, candidateName = "this record") => {
    if (!window.confirm(`Are you sure you want to delete the record for "${candidateName}"?`)) {
      return;
    }

    const collectionMap = {
      slot: "slot_registrations",
      event: "event_registrations",
      master: "master_registrations",
      aptitude: "aptitude_test_leads",
      old_aptitude: "aptitude_test_leads",
      collected: "collected_contacts",
      uploaded: "uploaded_contact_files",
      webinar: "webinar_registrations",
      admission: "admissions",
      consultation: "consultation_bookings"
    };

    const collectionName = collectionMap[activeTab] || "aptitude_test_leads";

    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.warn(`Primary delete from ${collectionName} failed, trying fallback:`, err);
      try {
        await deleteDoc(doc(db, "aptitude_test_leads", id));
      } catch (e) {}
      try {
        await deleteDoc(doc(db, "aptitude_submissions", id));
      } catch (e) {}
    }

    // Remove from local offline storage if present
    try {
      const localData = JSON.parse(localStorage.getItem("offline_aptitude_submissions") || "[]");
      const filtered = localData.filter((item) => item.id !== id);
      localStorage.setItem("offline_aptitude_submissions", JSON.stringify(filtered));
    } catch (e) {}

    try {
      const localConsultations = JSON.parse(localStorage.getItem("consultationBookings") || "[]");
      const filteredCons = localConsultations.filter((item) => item.id !== id);
      localStorage.setItem("consultationBookings", JSON.stringify(filteredCons));
    } catch (e) {}

    // Update state to remove deleted record from UI immediately
    setSlotData((prev) => prev.filter((item) => item.id !== id));
    setEventData((prev) => prev.filter((item) => item.id !== id));
    setMasterData((prev) => prev.filter((item) => item.id !== id));
    setNewAptitudeData((prev) => prev.filter((item) => item.id !== id));
    setOldAptitudeData((prev) => prev.filter((item) => item.id !== id));
    setCollectedData((prev) => prev.filter((item) => item.id !== id));
    setUploadedData((prev) => prev.filter((item) => item.id !== id));
    setWebinarData((prev) => prev.filter((item) => item.id !== id));
    setAdmissionData((prev) => prev.filter((item) => item.id !== id));
    setConsultationData((prev) => prev.filter((item) => item.id !== id));
  };

  const renderCards = (data) => {
    if (data.length === 0) {
      return <p className="text-center py-10 text-[#050521]/50 font-bold uppercase tracking-widest">No registrations found.</p>;
    }
    
    if (activeTab === "admission") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {data.map((item) => (
            <AdmissionCard key={item.id} item={item} onDelete={handleDeleteRecord} />
          ))}
        </div>
      );
    }

    if (activeTab === "aptitude") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {data.map((item) => (
            <AptitudeSubmissionCard key={item.id} item={item} onDelete={handleDeleteRecord} />
          ))}
        </div>
      );
    }

    if (activeTab === "consultation") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {data.map((item) => (
            <ConsultationCard key={item.id} item={item} onDelete={handleDeleteRecord} />
          ))}
        </div>
      );
    }
    
    // Extract headers from the first item, excluding unwanted fields if necessary
    const headers = Object.keys(data[0]).filter(k => k !== "timestamp" && k !== "id");
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {data.map((item) => (
          <DataCard key={item.id} item={item} headers={headers} onDelete={handleDeleteRecord} />
        ))}
      </div>
    );
  };

  const getActiveData = () => {
    if (activeTab === "slot") return slotData;
    if (activeTab === "event") return eventData;
    if (activeTab === "master") return masterData;
    if (activeTab === "aptitude") return newAptitudeData;
    if (activeTab === "old_aptitude") return oldAptitudeData;
    if (activeTab === "collected") return collectedData;
    if (activeTab === "uploaded") return uploadedData;
    if (activeTab === "webinar") return webinarData;
    if (activeTab === "admission") return admissionData;
    if (activeTab === "consultation") return consultationData;

    return slotData;
  };

  const getFilteredData = () => {
    const data = getActiveData();
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter(item => {
      return Object.entries(item).some(([key, val]) => {
        if (val === null || val === undefined) return false;
        if (key === "id") {
          return val.toLowerCase().slice(0, 8).includes(query);
        }
        if (typeof val === "object") {
          return Object.entries(val).some(([k, v]) => {
            if (v === true) {
              return k.toLowerCase().includes(query);
            }
            return String(v).toLowerCase().includes(query);
          });
        }
        return String(val).toLowerCase().includes(query);
      });
    });
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "slot": return "Slot Registrations";
      case "event": return "Event Entry";
      case "master": return "Master Class";
      case "aptitude": return "AI Aptitude Test (New)";
      case "old_aptitude": return "Aptitude Leads (Old)";
      case "collected": return "Collected Contacts";
      case "uploaded": return "Uploaded Files";
      case "webinar": return "Webinar Registrations";
      case "admission": return "Student Admissions";
      case "consultation": return "Free Consultations";
      default: return "Dashboard";
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f4f6f8] overflow-hidden text-[#050521]">
      
      {/* Sidebar */}
      <aside className="w-full md:w-[320px] bg-[#050521] text-white flex flex-col flex-shrink-0 z-20 shadow-2xl overflow-hidden h-auto md:h-screen">
        
        {/* Logo Area */}
        <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center md:block flex-shrink-0">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#c6ff34] shadow-[0_0_15px_#c6ff34] animate-pulse"></span>
              Admin Console
            </h1>
            <p className="text-white/40 font-bold uppercase tracking-widest text-[9px] mt-2 hidden md:block">Manage your data securely</p>
          </div>
          
          {/* Mobile Actions */}
          <div className="flex md:hidden gap-3">
             <button onClick={downloadCSV} className="px-4 py-2 bg-[#c6ff34] text-[#050521] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">Export</button>
             <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">Exit</button>
          </div>
        </div>
        
        {/* Navigation Area */}
        <div className="flex-1 p-4 md:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden hide-scrollbar">
          <div className="hidden md:block mb-2 px-2">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Collections</h3>
          </div>
          
          <button 
             onClick={() => setActiveTab("slot")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "slot" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Slot Registrations</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "slot" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{slotData.length}</span>
          </button>

          <button 
             onClick={() => setActiveTab("event")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "event" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Event Entry</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "event" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{eventData.length}</span>
          </button>

          <button 
             onClick={() => setActiveTab("master")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "master" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Master Class</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "master" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{masterData.length}</span>
          </button>

          <div className="hidden md:block my-2 border-t border-white/5"></div>

          <button 
             onClick={() => setActiveTab("aptitude")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "aptitude" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>AI Aptitude Test (New)</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "aptitude" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{newAptitudeData.length}</span>
          </button>

          <button 
             onClick={() => setActiveTab("old_aptitude")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "old_aptitude" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Aptitude Leads (Old)</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "old_aptitude" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{oldAptitudeData.length}</span>
          </button>

          <button 
             onClick={() => setActiveTab("collected")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "collected" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Collected Contacts</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "collected" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{collectedData.length}</span>
          </button>

          <button 
             onClick={() => setActiveTab("webinar")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "webinar" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Webinar Entry</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "webinar" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{webinarData.length}</span>
          </button>

          <button 
             onClick={() => setActiveTab("admission")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "admission" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Student Admissions</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "admission" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{admissionData.length}</span>
          </button>

          <button 
             onClick={() => setActiveTab("consultation")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "consultation" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Free Consultations</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "consultation" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{consultationData.length}</span>
          </button>

        </div>

        {/* Desktop User Profile Area */}
        <div className="hidden md:block p-6 border-t border-white/10 mt-auto flex-shrink-0">
           <div className="bg-white/5 rounded-2xl p-5 backdrop-blur-sm border border-white/5">
             <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">Signed in as</p>
             <p className="text-xs text-white font-medium truncate mb-5">{user?.email}</p>
             <div className="flex gap-3">
               <button 
                 onClick={downloadCSV} 
                 className="flex-1 py-3 bg-[#c6ff34]/10 text-[#c6ff34] border border-[#c6ff34]/20 hover:bg-[#c6ff34] hover:text-[#050521] hover:border-[#c6ff34] rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all"
               >
                 Export
               </button>
               <button 
                 onClick={handleLogout} 
                 className="flex-1 py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all"
               >
                 Logout
               </button>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-88px)] md:h-screen overflow-hidden relative bg-[#f4f6f8]">
        
        {/* Desktop Top Header (Hidden on Mobile) */}
        <header className="hidden md:flex h-24 bg-white/50 backdrop-blur-md border-b border-[#050521]/5 items-center justify-between px-10 flex-shrink-0 z-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#050521]">
              {getTabTitle()}
            </h2>
            <p className="text-[#050521]/40 font-bold uppercase tracking-widest text-[10px] mt-1">
              {searchQuery ? `Showing ${getFilteredData().length} of ${getActiveData().length} records` : `Currently viewing ${getActiveData().length} records`}
            </p>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 relative">
          
          {/* Mobile Title (Hidden on Desktop) */}
          <div className="md:hidden mb-6 px-2">
            <h2 className="text-2xl font-black tracking-tight text-[#050521]">{getTabTitle()}</h2>
            <p className="text-[#050521]/40 font-bold uppercase tracking-widest text-[9px] mt-1">
              {searchQuery ? `Showing ${getFilteredData().length} of ${getActiveData().length} records` : `${getActiveData().length} records found`}
            </p>
          </div>

          {/* Search Input */}
          {!loadingData && (
            <div className="mb-6 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${getTabTitle().toLowerCase()}...`}
                  className="w-full bg-white border border-[#050521]/10 rounded-2xl pl-12 pr-10 py-3.5 outline-none focus:border-[#c6ff34] focus:ring-1 focus:ring-[#c6ff34] text-xs font-black uppercase tracking-wider shadow-sm transition-all text-[#050521] placeholder:text-[#050521]/30"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#050521]/30 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#050521]/40 hover:text-[#050521] p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {loadingData ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 h-full">
              <div className="w-10 h-10 border-4 border-[#050521]/10 border-t-[#c6ff34] rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/40">Fetching Data...</p>
            </div>
          ) : (
            renderCards(getFilteredData())
          )}
        </div>
      </main>

    </div>
  );
}

export default AdminDashboard;
