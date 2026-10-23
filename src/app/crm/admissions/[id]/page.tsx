import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { ApplicationDetailClient } from "@/components/crm/ApplicationDetailClient";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <><CrmPageHeader title="Admission application" eyebrow="Admissions" description="Complete the family details and private documents, submit for review, then enroll after approval." /><ApplicationDetailClient id={id} /></>; }
