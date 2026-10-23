import type { ComponentProps } from "react";
import { School, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
export function CrmPageHeader(props: Omit<ComponentProps<typeof PageHeader>, "icon"> & { icon?: LucideIcon }) {
  return <PageHeader {...props} icon={props.icon ?? School} />;
}
