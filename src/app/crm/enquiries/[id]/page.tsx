import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
import { EnquiryDetailClient } from "@/components/crm/EnquiryDetailClient";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <><CrmPageHeader title="Enquiry details" eyebrow="Family pipeline" description="Family information, admissions, contacts and a persistent action history." /><EnquiryDetailClient id={id} /></>; }
