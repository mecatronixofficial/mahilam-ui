import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { CrmOperationsClient } from "@/components/crm/CrmOperationsClient";
export default function Page() { return <><CrmPageHeader title="Follow-ups" eyebrow="School operations" description="Plan and record calls, messages and parent meetings." /><CrmOperationsClient resource="follow-ups" /></>; }
