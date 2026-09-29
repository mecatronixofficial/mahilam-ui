import { History } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AuditLog } from "@/components/admin/AuditLog";

export default function Page() {
  return <><AdminPageHeader eyebrow="System" title="Activity Log" description="A record of every change made in the CMS and CRM — who did it, and when." icon={History} /><AuditLog /></>;
}
