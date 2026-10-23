import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { CrmOperationsClient } from "@/components/crm/CrmOperationsClient";
export default function Page() { return <><CrmPageHeader title="Message templates" eyebrow="School operations" description="Maintain reusable email, WhatsApp and conversation templates." /><CrmOperationsClient resource="templates" /></>; }
