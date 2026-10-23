import { Images } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageContentManager } from "@/components/admin/PageContentManager";

export default function Page() {
  return <><AdminPageHeader eyebrow="Homepage" title="Home Page Content" description="Manage section headings, descriptions and uploaded photos." icon={Images} /><PageContentManager page="home" /></>;
}
