import { Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
export default function Page(){return <><AdminPageHeader eyebrow="Review & publish" title="Parent Reviews" description="Verify family submissions and choose which stories are ready for the public homepage." icon={Star}/><TestimonialsManager /></>}
