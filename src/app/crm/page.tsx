import { LayoutDashboard } from "lucide-react";
import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { DashboardClient } from "@/components/crm/DashboardClient";

export default function Page() {
  return (
    <>
      <CrmPageHeader eyebrow="Today's workspace" title="Command Center" description="Families to call, applications to move forward and fees to collect — everything that keeps the school day moving." icon={LayoutDashboard} />
      <DashboardClient />
    </>
  );
}
