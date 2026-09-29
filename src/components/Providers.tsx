"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { ApiError } from "@/lib/api";
import { OfflineBanner } from "@/components/states/OfflineBanner";

/** Errors that retrying cannot fix. */
const FINAL_STATUSES = new Set([400, 401, 403, 404, 409, 422]);

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 10 * 60_000,
            refetchOnWindowFocus: false,
            retry: (count, error) => !(error instanceof ApiError && FINAL_STATUSES.has(error.status)) && count < 2,
          },
          mutations: { retry: false },
        },
      }),
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  return (
    <QueryClientProvider client={client}>
      {children}
      <OfflineBanner />
      <Toaster position="top-right" richColors closeButton toastOptions={{ className: "!rounded-2xl !font-bold" }} />
    </QueryClientProvider>
  );
}
