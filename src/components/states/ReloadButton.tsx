"use client";
import { RotateCw } from "lucide-react";

export function ReloadButton({ label = "Try again" }: { label?: string }) {
  return <button type="button" onClick={() => window.location.reload()} className="btn-primary"><RotateCw size={18} /> {label}</button>;
}
