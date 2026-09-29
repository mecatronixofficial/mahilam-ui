import type { Metadata } from "next";
import { BookOpen, Brush, Drama, Music2, Puzzle, PersonStanding } from "lucide-react";
import { SchoolHighlightsPage } from "@/components/public/SchoolHighlightsPage";
import { getPublic } from "@/lib/server-api";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata: Metadata = pageMetadata({ title: "Activities — Art, Music, Yoga & Play", description: "Art and craft, stories and phonics, music, yoga, role play and discovery games — the daily activities that help children at Little Mahilam, Tiruppur learn and grow.", path: "/activities", keywords: ["preschool activities Tiruppur", "kids art and music classes Tiruppur"] });

type CmsActivity = { id: string; name: string; description?: string | null; image?: string | null; benefits?: string | null };
const items = [
  { icon: Brush, title: "Art & craft", description: "Open-ended creative work develops imagination, focus and fine-motor coordination." },
  { icon: BookOpen, title: "Stories & phonics", description: "Songs, sounds and stories create a joyful foundation for language and early literacy." },
  { icon: Music2, title: "Music & movement", description: "Rhythm and dance support coordination, listening skills and confident self-expression." },
  { icon: PersonStanding, title: "Yoga & active play", description: "Age-appropriate movement builds balance, body awareness and healthy everyday habits." },
  { icon: Drama, title: "Role play", description: "Pretend play helps children understand their world, collaborate and communicate ideas." },
  { icon: Puzzle, title: "Games & discovery", description: "Puzzles and playful challenges strengthen reasoning, persistence and problem-solving." },
] as const;
export default async function Page() {
  const cms = await getPublic<CmsActivity[]>("/activities");
  const cmsItems = cms?.map((a) => ({ id: a.id, title: a.name, description: a.description, image: a.image, extra: a.benefits }));
  return <SchoolHighlightsPage path="/activities" cmsItems={cmsItems} eyebrow="Activities" title="Busy hands. Bright minds. Happy hearts." description="Every activity is an opportunity to explore, express, move, make and discover." introTitle="There is purpose behind every playful moment." intro="Our activity program gives children many ways to participate and succeed while developing creativity, communication and confidence." items={items} closingTitle="Space for every child to shine" closing="Activities are adapted for each age group and designed to invite participation without pressure—because children learn best when they feel safe, interested and included." />;
}
