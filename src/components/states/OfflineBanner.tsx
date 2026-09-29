"use client";
import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

/** Site-wide connectivity pill. React Query refetches automatically once the connection returns. */
export function OfflineBanner() {
  const [status, setStatus] = useState<"online" | "offline" | "restored">("online");

  useEffect(() => {
    let timer: number | undefined;
    const offline = () => { window.clearTimeout(timer); setStatus("offline"); };
    const online = () => { setStatus("restored"); timer = window.setTimeout(() => setStatus("online"), 3500); };
    if (!navigator.onLine) offline();
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    return () => { window.clearTimeout(timer); window.removeEventListener("offline", offline); window.removeEventListener("online", online); };
  }, []);

  if (status === "online") return null;
  const offline = status === "offline";
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4">
      <div className={`glass pointer-events-auto flex animate-fade-up items-center gap-3 rounded-full px-4 py-2.5 text-sm font-bold ${offline ? "text-amber-900" : "text-emerald-800"}`}>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${offline ? "bg-amber-100" : "bg-emerald-100"}`}>
          {offline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
        </span>
        {offline ? "You're offline. Some content may be out of date." : "Back online — refreshing content."}
      </div>
    </div>
  );
}
