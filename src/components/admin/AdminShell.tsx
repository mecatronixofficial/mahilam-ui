"use client";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return <DashboardShell mode="admin">{children}</DashboardShell>;
}
