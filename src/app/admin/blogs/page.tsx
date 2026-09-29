import { Newspaper } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BlogsManager } from "@/components/admin/BlogsManager";

export default function Page() {
  return (
    <>
      <AdminPageHeader eyebrow="Articles & news" title="Blogs" description="Draft useful stories, school updates and resources for the Little Mahilam community." icon={Newspaper} />
      <BlogsManager />
    </>
  );
}
