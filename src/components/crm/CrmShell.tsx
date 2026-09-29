"use client";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export function CrmShell({ children }: { children: React.ReactNode }) {
  return <DashboardShell mode="crm">{children}</DashboardShell>;
}
