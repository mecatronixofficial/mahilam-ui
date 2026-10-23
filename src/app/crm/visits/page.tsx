import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { CrmOperationsClient } from "@/components/crm/CrmOperationsClient";
export default function Page() { return <><CrmPageHeader title="School visits" eyebrow="School operations" description="Schedule campus visits, record feedback and track attendance." /><CrmOperationsClient resource="visits" /></>; }
