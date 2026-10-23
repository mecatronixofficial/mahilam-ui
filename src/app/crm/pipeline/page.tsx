import { PipelineClient } from "@/components/crm/PipelineClient";
import { CrmPageHeader } from "@/components/crm/CrmPageHeader";
export default function Page() { return <><CrmPageHeader title="Admission pipeline" eyebrow="Family pipeline" description="Move enquiries through their permitted stages, with saved history and application approval controls." /><PipelineClient /></>; }
