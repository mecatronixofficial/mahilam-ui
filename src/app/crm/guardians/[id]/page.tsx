import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { FamilyRecordClient } from "@/components/crm/FamilyRecordClient";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <><CrmPageHeader title="Guardian details" eyebrow="School operations" description="Family contact details, communication preferences and student links." /><FamilyRecordClient id={id} kind="guardian" /></>; }
