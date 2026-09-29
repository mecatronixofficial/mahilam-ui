"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCw, Wrench } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { StatusScreen } from "@/components/states/StatusScreen";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <PublicShell>
      <StatusScreen code="500" icon={Wrench} title="Something went wrong on our side." description="Our little helpers are already on it. Please try again in a moment.">
        <button type="button" onClick={() => reset()} className="btn-primary"><RotateCw size={18} /> Try again</button>
        <Link href="/" className="btn-soft"><Home size={18} /> Back to home</Link>
      </StatusScreen>
    </PublicShell>
  );
}
