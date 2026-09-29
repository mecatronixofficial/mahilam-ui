export const CLASSES = ["Play Group", "Pre-KG", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3"] as const;

export const ENQUIRY_STATUSES = ["NEW", "CONTACTED", "FOLLOW_UP", "VISIT_SCHEDULED", "VISITED", "APPLICATION_STARTED", "ADMISSION_CONFIRMED", "NOT_INTERESTED", "CLOSED"] as const;
export const ENQUIRY_SOURCES = ["WEBSITE", "WALK_IN", "PHONE", "WHATSAPP", "INSTAGRAM", "FACEBOOK", "REFERRAL", "GOOGLE", "OTHER"] as const;
export const ADMISSION_STATUSES = ["APPLICATION", "DOCUMENT_PENDING", "VERIFICATION", "FEE_PENDING", "CONFIRMED", "REJECTED", "CANCELLED"] as const;
export const STUDENT_STATUSES = ["ACTIVE", "INACTIVE", "GRADUATED", "LEFT", "TRANSFERRED"] as const;
export const FEE_STATUSES = ["PENDING", "PARTIAL", "PAID", "OVERDUE", "WAIVED"] as const;
export const PAYMENT_METHODS = ["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE", "OTHER"] as const;

/** One colour language for statuses across the CRM. */
export const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-sky-100/80 text-sky-800",
  CONTACTED: "bg-slate-200/70 text-slate-700",
  FOLLOW_UP: "bg-amber-100/80 text-amber-800",
  VISIT_SCHEDULED: "bg-violet-100/80 text-violet-800",
  VISITED: "bg-indigo-100/80 text-indigo-800",
  APPLICATION_STARTED: "bg-teal-100/80 text-teal-800",
  ADMISSION_CONFIRMED: "bg-emerald-100/80 text-emerald-800",
  NOT_INTERESTED: "bg-rose-100/80 text-rose-700",
  CLOSED: "bg-slate-200/60 text-slate-500",

  APPLICATION: "bg-sky-100/80 text-sky-800",
  DOCUMENT_PENDING: "bg-amber-100/80 text-amber-800",
  VERIFICATION: "bg-violet-100/80 text-violet-800",
  FEE_PENDING: "bg-orange-100/80 text-orange-800",
  CONFIRMED: "bg-emerald-100/80 text-emerald-800",
  REJECTED: "bg-rose-100/80 text-rose-700",
  CANCELLED: "bg-slate-200/60 text-slate-500",

  ACTIVE: "bg-emerald-100/80 text-emerald-800",
  INACTIVE: "bg-slate-200/60 text-slate-500",
  GRADUATED: "bg-sky-100/80 text-sky-800",
  LEFT: "bg-amber-100/80 text-amber-800",
  TRANSFERRED: "bg-violet-100/80 text-violet-800",

  PENDING: "bg-amber-100/80 text-amber-800",
  PARTIAL: "bg-sky-100/80 text-sky-800",
  PAID: "bg-emerald-100/80 text-emerald-800",
  OVERDUE: "bg-rose-100/80 text-rose-700",
  WAIVED: "bg-slate-200/60 text-slate-500",
};

export function whatsappLink(phone?: string | null) {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}
