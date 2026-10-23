export const CLASSES = ["Play Group", "Pre-KG", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3"] as const;

export const ENQUIRY_STATUSES = ["NEW_ENQUIRY", "QUALIFIED", "VISIT_COMPLETED", "DOCUMENTS_PENDING", "APPLICATION_SUBMITTED", "APPROVED", "ENROLLED", "WAITLISTED", "REJECTED", "LOST", "NEW", "CONTACTED", "FOLLOW_UP", "VISIT_SCHEDULED", "VISITED", "APPLICATION_STARTED", "ADMISSION_CONFIRMED", "NOT_INTERESTED", "CLOSED"] as const;
export const ENQUIRY_SOURCES = ["WEBSITE", "WALK_IN", "PHONE", "WHATSAPP", "INSTAGRAM", "FACEBOOK", "REFERRAL", "GOOGLE", "OTHER"] as const;
export const ADMISSION_STATUSES = ["DRAFT", "SUBMITTED", "APPROVED", "WAITLISTED", "ENROLLED", "APPLICATION", "DOCUMENT_PENDING", "VERIFICATION", "FEE_PENDING", "CONFIRMED", "REJECTED", "CANCELLED"] as const;
export const STUDENT_STATUSES = ["ACTIVE", "INACTIVE", "GRADUATED", "LEFT", "TRANSFERRED"] as const;
export const FEE_STATUSES = ["PENDING", "PARTIAL", "PAID", "OVERDUE", "WAIVED"] as const;
export const PAYMENT_METHODS = ["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE", "OTHER"] as const;

/** One colour language for statuses across the CRM. */
export const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-little-blue-100/80 text-little-blue-800",
  CONTACTED: "bg-little-neutral-200/70 text-little-neutral-700",
  FOLLOW_UP: "bg-little-yellow-100/80 text-little-yellow-800",
  VISIT_SCHEDULED: "bg-little-pink-100/80 text-little-pink-800",
  VISITED: "bg-little-blue-100/80 text-little-blue-800",
  APPLICATION_STARTED: "bg-little-blue-100/80 text-little-blue-800",
  ADMISSION_CONFIRMED: "bg-little-green-100/80 text-little-green-800",
  NOT_INTERESTED: "bg-little-coral-100/80 text-little-coral-700",
  CLOSED: "bg-little-neutral-200/60 text-little-neutral-500",

  APPLICATION: "bg-little-blue-100/80 text-little-blue-800",
  DOCUMENT_PENDING: "bg-little-yellow-100/80 text-little-yellow-800",
  VERIFICATION: "bg-little-pink-100/80 text-little-pink-800",
  FEE_PENDING: "bg-little-coral-100/80 text-little-coral-800",
  CONFIRMED: "bg-little-green-100/80 text-little-green-800",
  REJECTED: "bg-little-coral-100/80 text-little-coral-700",
  CANCELLED: "bg-little-neutral-200/60 text-little-neutral-500",

  ACTIVE: "bg-little-green-100/80 text-little-green-800",
  INACTIVE: "bg-little-neutral-200/60 text-little-neutral-500",
  GRADUATED: "bg-little-blue-100/80 text-little-blue-800",
  LEFT: "bg-little-yellow-100/80 text-little-yellow-800",
  TRANSFERRED: "bg-little-pink-100/80 text-little-pink-800",

  PENDING: "bg-little-yellow-100/80 text-little-yellow-800",
  PARTIAL: "bg-little-blue-100/80 text-little-blue-800",
  PAID: "bg-little-green-100/80 text-little-green-800",
  OVERDUE: "bg-little-coral-100/80 text-little-coral-700",
  WAIVED: "bg-little-neutral-200/60 text-little-neutral-500",
};

export function whatsappLink(phone?: string | null) {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}
