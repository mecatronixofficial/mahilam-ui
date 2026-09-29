import type { Metadata } from "next";
import Link from "next/link";
import { Home, LogIn, ShieldAlert } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { StatusScreen } from "@/components/states/StatusScreen";

export const metadata: Metadata = { title: "Permission denied", robots: { index: false, follow: false } };

export default function ForbiddenPage() {
  return (
    <PublicShell>
      <StatusScreen code="403" icon={ShieldAlert} title="Permission denied" description="Your account doesn't have access to this area. If you think it should, please ask a school administrator to update your role.">
        <Link href="/crm" className="btn-primary"><LogIn size={18} /> Go to my workspace</Link>
        <Link href="/" className="btn-soft"><Home size={18} /> Website home</Link>
      </StatusScreen>
    </PublicShell>
  );
}
