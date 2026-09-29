import { Palette } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CatalogManager } from "@/components/admin/CatalogManager";

export default function Page() {
  return <><AdminPageHeader eyebrow="School pages" title="Activities" description="Art, music, movement and discovery — the everyday experiences families see on the website." icon={Palette} /><CatalogManager kind="activities" /></>;
}
