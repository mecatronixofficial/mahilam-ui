import type { Metadata } from "next";
import { CrmShell } from "@/components/crm/CrmShell";
export const metadata: Metadata = { title: "CRM", robots: { index: false, follow: false } };
export default function Layout({children}:{children:React.ReactNode}){return <CrmShell>{children}</CrmShell>}
