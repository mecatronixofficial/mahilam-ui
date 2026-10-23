export const ENQUIRY_PHONE = /^(?=(?:\D*\d){7,15}\D*$)\+?[\d()\s-]{7,24}$/;

export type PublicEnquiryInput = { parentName: string; studentName: string; phone: string; email: string; interestedClass: string; message: string };

/** Keep these limits aligned with CreateEnquiryDto in the existing Nest API. */
export function validatePublicEnquiry(form: PublicEnquiryInput) {
  const errors: Partial<Record<keyof PublicEnquiryInput, string>> = {};
  for (const key of ["parentName", "studentName"] as const) {
    const length = form[key].trim().length;
    if (length < 2 || length > 80) errors[key] = key === "parentName" ? "Please enter your name (2–80 characters)." : "Please enter your child's name (2–80 characters).";
  }
  if (!ENQUIRY_PHONE.test(form.phone.trim())) errors.phone = "Please enter a valid phone number, including the country code for international numbers.";
  const email = form.email.trim();
  if (email && (email.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) errors.email = "Please check the email address.";
  if (!form.interestedClass.trim() || form.interestedClass.trim().length > 60) errors.interestedClass = "Please select a program.";
  if (form.message.trim().length > 2000) errors.message = "Please keep your message within 2,000 characters.";
  return errors;
}
