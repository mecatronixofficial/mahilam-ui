import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { CrmOperationsClient } from "@/components/crm/CrmOperationsClient";
export default function Page() { return <><CrmPageHeader title="Tasks & calendar" eyebrow="School operations" description="Assign school work and track due dates and completion." /><CrmOperationsClient resource="tasks" /></>; }
