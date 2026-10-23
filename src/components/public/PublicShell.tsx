import "server-only";
import { PublicShellView } from "./PublicShellView";
import { getBranding, getPublic } from "@/lib/server-api";
import { resolvePublicSite } from "@/lib/site";

export async function PublicShell({ children }: { children: React.ReactNode }) {
  const [settings, branding] = await Promise.all([getPublic<Record<string, unknown>>("/settings", 0), getBranding()]);
  const publicSite = resolvePublicSite(settings);
  return <PublicShellView photoSettings={settings ?? {}} siteDetails={publicSite} branding={branding}>{children}</PublicShellView>;
}
