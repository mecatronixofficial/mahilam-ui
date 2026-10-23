import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { CrmOperationsClient } from "@/components/crm/CrmOperationsClient";
export default function Page() { return <><CrmPageHeader title="Communication history" eyebrow="School operations" description="Record parent conversations and messages with their actual outcomes." /><CrmOperationsClient resource="communications" /></>; }
