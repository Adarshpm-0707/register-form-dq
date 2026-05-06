// ─────────────────────────────────────────────────────
//  components/RegistrationForm.jsx
//  Premium Dark Glassmorphism Registration Form
// ─────────────────────────────────────────────────────

import React, { useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import SubmitButton from "./SubmitButton";
import { validateForm, isFormValid } from "../utils/validation";
import { saveRegistration } from "../services/registrationService";

const COURSES = [
  { value: "BCA", label: "BCA" },
  { value: "MCA", label: "MCA" },
  { value: "BTech", label: "BTech" },
  { value: "MTech", label: "MTech" },
  { value: "MBA", label: "MBA" },
];

const CAMPUSES = [
  { value: "Kochi", label: "Kochi" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Chennai", label: "Chennai" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Trivandrum", label: "Trivandrum" },
];

function RegistrationForm() {
  const [values, setValues] = useState({
    fullName: "", phone: "", email: "", address: "",
    course: "", campus: "", academicYear: "", completionYear: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(values);
    if (!isFormValid(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await saveRegistration(values);
      setStatus("success");
      setValues({
        fullName: "", phone: "", email: "", address: "",
        course: "", campus: "", academicYear: "", completionYear: "",
      });
    } catch (err) {
      setStatus("error");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "success" && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-400 text-sm font-bold text-center animate-bounce">
          Registration Successful! Welcome to Deepstaq.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <InputField id="fullName" label="Full Name" placeholder="John Doe" value={values.fullName} onChange={handleChange("fullName")} error={errors.fullName} />
        <InputField id="phone" label="Phone Number" placeholder="10 Digits" value={values.phone} onChange={handleChange("phone")} error={errors.phone} />
      </div>

      <InputField id="email" label="Email Address" type="email" placeholder="john@example.com" value={values.email} onChange={handleChange("email")} error={errors.email} />
      <TextAreaField id="address" label="Address" placeholder="Your residential address" value={values.address} onChange={handleChange("address")} error={errors.address} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <SelectField id="course" label="Course" placeholder="Select Course" options={COURSES} value={values.course} onChange={handleChange("course")} error={errors.course} />
        <SelectField id="campus" label="Campus" placeholder="Select Campus" options={CAMPUSES} value={values.campus} onChange={handleChange("campus")} error={errors.campus} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <InputField id="academicYear" label="Academic Year" placeholder="e.g. 2023-24" value={values.academicYear} onChange={handleChange("academicYear")} error={errors.academicYear} />
        <InputField id="completionYear" label="Completion Year" placeholder="e.g. 2026" value={values.completionYear} onChange={handleChange("completionYear")} error={errors.completionYear} />
      </div>



      <div className="pt-4">
        <SubmitButton isLoading={isLoading} label="Complete Registration" />
      </div>
    </form>
  );
}

export default RegistrationForm;
