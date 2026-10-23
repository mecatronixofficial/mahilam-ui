"use client";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { schoolPhoto, WEBSITE_PHOTO_SLOTS, PHOTO_GROUP_LABELS, websitePhotoKey } from "@/lib/school-photos";
import { SectionEditor } from "./PageContentManager";
import { QueryState } from "@/components/states/QueryState";

export function WebsitePhotosManager({ initialGroup = "home" }: { initialGroup?: string }) {
  const [group, setGroup] = useState(initialGroup);
  const query = useQuery({ queryKey: ["settings"], queryFn: () => api<{ data: { key: string; value: unknown }[] }>("/cms/settings") });
  const saved = query.data?.data.find((row) => row.key === websitePhotoKey(group))?.value;
  const section = { id: group, title: PHOTO_GROUP_LABELS[group], fields: [], photos: WEBSITE_PHOTO_SLOTS.filter((slot) => slot.group === group).map((slot) => ({ key: slot.id, label: slot.title, fallback: slot.sourcePath, alt: schoolPhoto(slot.photoId).alt })) };
  return <>
    <div className="panel mb-5 grid gap-3 p-4">
      <p className="text-sm text-little-neutral-600">The supplied school photos are placed by activity and page. Choose a page to upload replacements, then save to publish. Home and About section uploads, banner slides and program covers take precedence over these default page photos.</p>
      <label className="grid max-w-md gap-1.5"><span className="label">Website page</span><select className="input" value={group} onChange={(event) => setGroup(event.target.value)}>{Object.entries(PHOTO_GROUP_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <div className="flex flex-wrap gap-4 text-sm font-bold"><Link className="underline" href="/admin/gallery">Manage all gallery albums</Link><Link className="underline" href="/admin/banners">Manage hero slides</Link><Link className="underline" href="/admin/about">About headings and founder portraits</Link></div>
    </div>
    <QueryState query={query}><div className="max-w-4xl"><SectionEditor key={`${group}:${JSON.stringify(saved)}`} settingKey={websitePhotoKey(group)} section={section} saved={saved} /></div></QueryState>
  </>;
}
