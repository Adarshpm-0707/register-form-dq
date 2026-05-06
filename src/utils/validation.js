// ─────────────────────────────────────────────────────
//  utils/validation.js
// ─────────────────────────────────────────────────────

export const validateForm = (values) => {
  const errors = {};

  if (!values.fullName?.trim()) {
    errors.fullName = "Full Name is required";
  }

  if (!values.phone?.trim()) {
    errors.phone = "Phone Number is required";
  } else if (!/^\d{10}$/.test(values.phone)) {
    errors.phone = "Must be exactly 10 digits";
  }

  if (!values.email?.trim()) {
    errors.email = "Email ID is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Invalid email format";
  }

  if (!values.address?.trim()) {
    errors.address = "Address is required";
  }

  if (!values.course) {
    errors.course = "Please select a course";
  }

  if (!values.campus) {
    errors.campus = "Please select a campus";
  }

  if (!values.academicYear?.trim()) {
    errors.academicYear = "Academic Year is required";
  }

  if (!values.completionYear?.trim()) {
    errors.completionYear = "Completion Year is required";
  }

  return errors;
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
