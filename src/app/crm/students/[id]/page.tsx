import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { FamilyRecordClient } from "@/components/crm/FamilyRecordClient";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <><CrmPageHeader title="Student record" eyebrow="School operations" description="Student enrollment and family information." /><FamilyRecordClient id={id} kind="student" /></>; }
