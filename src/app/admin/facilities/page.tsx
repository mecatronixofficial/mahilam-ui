import { Building2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CatalogManager } from "@/components/admin/CatalogManager";

export default function Page() {
  return <><AdminPageHeader eyebrow="School pages" title="Facilities" description="Showcase classrooms, play areas and campus spaces for visiting families." icon={Building2} /><CatalogManager kind="facilities" /></>;
}
