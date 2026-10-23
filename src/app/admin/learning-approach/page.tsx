import { Lightbulb } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { WebsitePhotosManager } from "@/components/admin/WebsitePhotosManager";
export default function Page() {
  return <><AdminPageHeader eyebrow="School pages" title="Learning Approach Photos" description="Upload and publish the photos shown on the Learning Approach page." icon={Lightbulb} /><WebsitePhotosManager initialGroup="learning" /></>;
}
