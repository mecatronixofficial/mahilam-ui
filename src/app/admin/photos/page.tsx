import { Images } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { WebsitePhotosManager } from "@/components/admin/WebsitePhotosManager";
export default function Page() {
  return <><AdminPageHeader eyebrow="School pages" title="Website Photos" description="Manage the school photos placed across every website page." icon={Images} /><WebsitePhotosManager /></>;
}
