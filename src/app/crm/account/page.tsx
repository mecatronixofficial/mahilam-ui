import { UserCog } from "lucide-react";
import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { AccountClient } from "@/components/crm/AccountClient";

export default function Page() {
  return <><CrmPageHeader eyebrow="Your profile" title="My Account" description="Review your access and keep your login secure." icon={UserCog} /><AccountClient /></>;
}
