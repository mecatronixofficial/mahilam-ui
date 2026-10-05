import { School } from "lucide-react";
import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { AcademicsClient } from "@/components/crm/AcademicsClient";

export default function Page() {
  return <><CrmPageHeader eyebrow="School setup" title="Academics" description="Manage academic years, classes, sections, rooms and capacity used by student records." icon={School} /><AcademicsClient /></>;
}
