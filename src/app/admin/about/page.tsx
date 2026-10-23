import { School } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageContentManager } from "@/components/admin/PageContentManager";

export default function Page() {
  return <><AdminPageHeader eyebrow="School pages" title="About Page Content" description="Manage all About sections, founder portraits and page photos." icon={School} /><PageContentManager page="about" /></>;
}
