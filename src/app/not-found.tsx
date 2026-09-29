import type { Metadata } from "next";
import Link from "next/link";
import { Home, MessageCircle, SearchX } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { ExploreMore } from "@/components/public/ExploreMore";
import { StatusScreen } from "@/components/states/StatusScreen";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <PublicShell>
      <StatusScreen code="404" icon={SearchX} title="Oops! This page took a nap." description="We couldn't find the page you were looking for. It may have moved — let's get you somewhere fun.">
        <Link href="/" className="btn-primary"><Home size={18} /> Back to home</Link>
        <Link href="/contact" className="btn-soft"><MessageCircle size={18} /> Contact us</Link>
      </StatusScreen>
      <ExploreMore />
    </PublicShell>
  );
}
