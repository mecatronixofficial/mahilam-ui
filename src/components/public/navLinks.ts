import { BookOpen, Building2, CalendarDays, GraduationCap, Home, Images, Info, Lightbulb, MessageCircle, Palette, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";

/** One destination: pastel tile + deeper ink from the logo palette (used by the header and the mobile menu). */
export type NavLink = { href: string; label: string; note: string; icon: LucideIcon; tile: string; ink: string };

export const HOME: NavLink = { href: "/", label: "Home", note: "Start here", icon: Home, tile: BRAND.green[100], ink: BRAND.green[700] };

/** Grouped under "About" on desktop. */
export const ABOUT_GROUP: NavLink[] = [
  { href: "/about", label: "About Us", note: "Our story & founders", icon: Info, tile: BRAND.pink[50], ink: BRAND.pink[600] },
  { href: "/learning-approach", label: "Learning Approach", note: "How little minds learn", icon: Lightbulb, tile: BRAND.yellow[100], ink: BRAND.yellow[700] },
  { href: "/activities", label: "Activities", note: "Play, make & move", icon: Palette, tile: BRAND.coral[100], ink: BRAND.coral[600] },
  { href: "/facilities", label: "Facilities", note: "Our happy spaces", icon: Building2, tile: BRAND.blue[100], ink: BRAND.blue[700] },
];

export const MAIN: NavLink[] = [
  { href: "/programs", label: "Programs", note: "Play Group to Grade 3", icon: GraduationCap, tile: BRAND.yellow[100], ink: BRAND.yellow[700] },
  { href: "/gallery", label: "Gallery", note: "Happy school moments", icon: Images, tile: BRAND.blue[100], ink: BRAND.blue[700] },
  { href: "/events", label: "Events", note: "Celebrations & calendar", icon: CalendarDays, tile: BRAND.coral[100], ink: BRAND.coral[600] },
  { href: "/blog", label: "Blog", note: "Tips & stories for parents", icon: BookOpen, tile: BRAND.pink[50], ink: BRAND.pink[600] },
  { href: "/contact", label: "Contact", note: "Visit, call or write", icon: MessageCircle, tile: BRAND.green[50], ink: BRAND.green[800] },
];

/** Everything, in menu order (mobile). */
export const ALL_LINKS: NavLink[] = [HOME, ...ABOUT_GROUP, ...MAIN];

/** Is `href` the current page (or a page under it, e.g. /blog/some-post)? */
export const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

