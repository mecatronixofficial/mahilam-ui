import { CalendarDays } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EventsManager } from "@/components/admin/EventsManager";

export default function Page() {
  return (
    <>
      <AdminPageHeader eyebrow="School calendar" title="Events" description="Plan celebrations, parent meetings and special days that appear on the public events page." icon={CalendarDays} />
      <EventsManager />
    </>
  );
}
