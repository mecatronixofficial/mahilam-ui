import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Home, LogIn } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { StatusScreen } from "@/components/states/StatusScreen";

export const metadata: Metadata = { title: "Session expired", robots: { index: false, follow: false } };

export default function SessionExpiredPage() {
  return (
    <PublicShell>
      <StatusScreen icon={Clock3} title="Your session has expired" description="For your security, you were signed out after a period of inactivity. Sign in again to pick up where you left off.">
        <Link href="/login?reason=expired" className="btn-primary"><LogIn size={18} /> Sign in again</Link>
        <Link href="/" className="btn-soft"><Home size={18} /> Website home</Link>
      </StatusScreen>
    </PublicShell>
  );
}
