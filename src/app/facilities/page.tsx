import type { Metadata } from "next";
import { BookHeart, Building2, Palette, ShieldCheck, Sun, ToyBrick } from "lucide-react";
import { SchoolHighlightsPage } from "@/components/public/SchoolHighlightsPage";
import { getPublic } from "@/lib/server-api";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({ title: "Facilities — A Safe, Bright Campus", description: "Welcoming classrooms, play spaces, reading corners and child-friendly design at Little Mahilam Preschool on Kangayam Road, Tiruppur. Book a campus visit.", path: "/facilities", keywords: ["preschool campus Tiruppur", "safe play school Tiruppur"] });

type CmsFacility = { id: string; title: string; description?: string | null; image?: string | null };
const items = [
  { icon: Building2, title: "Welcoming classrooms", description: "Comfortable learning spaces support conversation, group work and independent discovery." },
  { icon: ToyBrick, title: "Play spaces", description: "Purposeful play areas encourage movement, imagination, sharing and joyful friendships." },
  { icon: BookHeart, title: "Reading corners", description: "Inviting book spaces help children slow down, listen and develop a love for stories." },
  { icon: Palette, title: "Activity zones", description: "Flexible areas make room for art, sensory experiences, music and hands-on projects." },
  { icon: ShieldCheck, title: "Child-friendly design", description: "Spaces are organised around young learners, with safety and ease of movement in mind." },
  { icon: Sun, title: "Bright environment", description: "Cheerful surroundings help children feel comfortable, curious and ready to participate." },
] as const;
export default async function Page() {
  const cms = await getPublic<CmsFacility[]>("/facilities");
  return <SchoolHighlightsPage path="/facilities" cmsItems={cms} eyebrow="Facilities" title="Made for little learners." description="Warm, engaging spaces thoughtfully arranged for childhood learning, play and belonging." introTitle="The environment is part of the learning experience." intro="Children thrive when spaces feel welcoming and understandable. Our campus is planned to encourage safe exploration and growing independence." items={items} closingTitle="The best way to know us is to visit" closing="We invite families to see our learning spaces, meet the team and experience the warm Little Mahilam atmosphere in person. Book ahead so we can give you a guided visit." />;
}
