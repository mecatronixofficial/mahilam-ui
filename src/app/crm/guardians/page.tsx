import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { CrmOperationsClient } from "@/components/crm/CrmOperationsClient";
export default function Page() { return <><CrmPageHeader title="Parents & guardians" eyebrow="School operations" description="Maintain family contacts and link guardians to student records." /><CrmOperationsClient resource="guardians" /></>; }
