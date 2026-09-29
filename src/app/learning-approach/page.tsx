import type { Metadata } from "next";
import { Brain, Gamepad2, HeartHandshake, Lightbulb, MessageCircle, Users } from "lucide-react";
import { SchoolHighlightsPage } from "@/components/public/SchoolHighlightsPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: "Learning Approach — Play-Way & Multiple Intelligence", description: "How Little Mahilam teaches: child-centric, play-way learning built on multiple intelligences, language, social-emotional growth and curiosity-led discovery.", path: "/learning-approach", keywords: ["play-way method preschool", "multiple intelligence preschool Tiruppur", "child-centric learning"] });
const items = [
  { icon: HeartHandshake, title: "Child-centric learning", description: "Every child's interests, pace and voice help shape a supportive learning journey." },
  { icon: Gamepad2, title: "Learning through play", description: "Purposeful games and hands-on experiences make new concepts meaningful and memorable." },
  { icon: Brain, title: "Multiple intelligence", description: "Language, movement, music, logic, nature and creativity are all valued ways to learn." },
  { icon: MessageCircle, title: "Language & expression", description: "Stories, conversation and role play help children communicate with growing confidence." },
  { icon: Users, title: "Social-emotional growth", description: "Children practise kindness, independence, cooperation and healthy ways to express feelings." },
  { icon: Lightbulb, title: "Curiosity-led discovery", description: "Questions and exploration are encouraged so children become active, enthusiastic learners." },
] as const;
export default function Page() { return <SchoolHighlightsPage path="/learning-approach" eyebrow="Learning approach" title="Joyful learning with purpose." description="A balanced approach that helps every child think, create, communicate and grow with confidence." introTitle="Childhood is not a race—it is a journey to enjoy." intro="At Little Mahilam, strong foundations grow from warm relationships, thoughtful play and experiences that respect the whole child." items={items} closingTitle="Learning that reaches beyond the classroom" closing="Our approach brings together early academics, creativity, physical movement and emotional wellbeing so children are ready for school and excited about learning." />; }
