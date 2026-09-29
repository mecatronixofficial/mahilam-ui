import { GraduationCap } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CatalogManager } from "@/components/admin/CatalogManager";

export default function Page() {
  return <><AdminPageHeader eyebrow="School pages" title="Programs" description="Manage Play Group through Grade 3 program details shown on the public Programs page." icon={GraduationCap} /><CatalogManager kind="programs" /></>;
}
