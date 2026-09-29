import { LayoutDashboard } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
export default function Page(){return <><AdminPageHeader eyebrow="Content overview" title="Good to see you." description="Monitor the content powering Little Mahilam's public website and jump into your most important publishing tasks." icon={LayoutDashboard}/><AdminDashboard/></>}
