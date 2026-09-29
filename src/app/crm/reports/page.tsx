import { BarChart3 } from "lucide-react";
import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { ReportsClient } from "@/components/crm/ReportsClient";

export default function Page() {
  return (
    <>
      <CrmPageHeader eyebrow="School insights" title="Reports" description="Enquiry trends, admission progress and fee collections — with CSV exports for your records." icon={BarChart3} />
      <ReportsClient />
    </>
  );
}
