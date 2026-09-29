import type { Metadata } from "next";
import Link from "next/link";
import { Home, WifiOff } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { StatusScreen } from "@/components/states/StatusScreen";
import { ReloadButton } from "@/components/states/ReloadButton";

export const metadata: Metadata = { title: "You're offline", robots: { index: false, follow: false } };

export default function OfflinePage() {
  return (
    <PublicShell>
      <StatusScreen icon={WifiOff} title="You're offline" description="We can't reach the internet right now. Check your Wi-Fi or mobile data — everything will work again as soon as you're connected.">
        <ReloadButton />
        <Link href="/" className="btn-soft"><Home size={18} /> Home</Link>
      </StatusScreen>
    </PublicShell>
  );
}
