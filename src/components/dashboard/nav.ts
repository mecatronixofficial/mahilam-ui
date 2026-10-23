import type { LucideIcon } from "lucide-react";
import {
  Activity, Banknote, BarChart3, Building2, CalendarDays, ClipboardCheck, GraduationCap, History, Images, LayoutDashboard, Lightbulb,
  MailOpen, Megaphone, Newspaper, Palette, School, Settings, Star, UserCog, UserPlus, Users,
} from "lucide-react";

export type WorkspaceMode = "admin" | "crm";
export type NavItem = { href: string; icon: LucideIcon; label: string; helper: string; group: string; adminOnly?: boolean };

export const NAV: Record<WorkspaceMode, NavItem[]> = {
  admin: [
    { href: "/admin", icon: LayoutDashboard, label: "Overview", helper: "Content pulse", group: "Workspace" },
    { href: "/admin/announcements", icon: Megaphone, label: "Announcements", helper: "Notices & updates", group: "Homepage" },
    { href: "/admin/home", icon: Images, label: "Home Page", helper: "Headings & photos", group: "Homepage" },
    { href: "/admin/banners", icon: Images, label: "Banners", helper: "Hero slides", group: "Homepage" },
    { href: "/admin/testimonials", icon: Star, label: "Parent Reviews", helper: "Review & publish", group: "Homepage" },
    { href: "/admin/about", icon: School, label: "About Page", helper: "Headings & photos", group: "School pages" },
    { href: "/admin/learning-approach", icon: Lightbulb, label: "Learning Approach", helper: "Page photos", group: "School pages" },
    { href: "/admin/programs", icon: GraduationCap, label: "Programs", helper: "Classes & age groups", group: "School pages" },
    { href: "/admin/activities", icon: Palette, label: "Activities", helper: "Learning experiences", group: "School pages" },
    { href: "/admin/facilities", icon: Building2, label: "Facilities", helper: "Campus spaces", group: "School pages" },
    { href: "/admin/photos", icon: Images, label: "Website Photos", helper: "Photos across all pages", group: "School pages" },
    { href: "/admin/gallery", icon: Images, label: "Gallery", helper: "Albums & media", group: "Stories" },
    { href: "/admin/events", icon: CalendarDays, label: "Events", helper: "School calendar", group: "Stories" },
    { href: "/admin/blogs", icon: Newspaper, label: "Blog", helper: "Articles & news", group: "Stories" },
    { href: "/admin/subscribers", icon: MailOpen, label: "Subscribers", helper: "Newsletter list", group: "Stories" },
    { href: "/admin/settings", icon: Settings, label: "Settings", helper: "Website details", group: "System" },
    { href: "/admin/activity", icon: History, label: "Activity Log", helper: "Who changed what", group: "System" },
  ],
  crm: [
    { href: "/crm", icon: LayoutDashboard, label: "Command Center", helper: "Daily overview", group: "Workspace" },
    { href: "/crm/enquiries", icon: UserPlus, label: "Enquiries", helper: "New family leads", group: "Families" },
    { href: "/crm/pipeline", icon: Activity, label: "Lead Pipeline", helper: "Admission stages", group: "Families" },
    { href: "/crm/follow-ups", icon: History, label: "Follow-ups", helper: "Calls & reminders", group: "Families" },
    { href: "/crm/visits", icon: CalendarDays, label: "School Visits", helper: "Tours & feedback", group: "Families" },
    { href: "/crm/admissions", icon: ClipboardCheck, label: "Admissions", helper: "Applications pipeline", group: "Families" },
    { href: "/crm/students", icon: GraduationCap, label: "Students", helper: "Learner records", group: "School" },
    { href: "/crm/guardians", icon: Users, label: "Guardians", helper: "Family contacts", group: "School" },
    { href: "/crm/attendance", icon: ClipboardCheck, label: "Attendance", helper: "Daily & monthly records", group: "School" },
    { href: "/crm/academics", icon: School, label: "Academics", helper: "Years, classes & sections", group: "School" },
    { href: "/crm/fees", icon: Banknote, label: "Fees", helper: "Payments & balances", group: "School" },
    { href: "/crm/reports", icon: BarChart3, label: "Reports", helper: "Insights & exports", group: "School" },
    { href: "/crm/tasks", icon: CalendarDays, label: "Tasks", helper: "Work & calendar", group: "Team" },
    { href: "/crm/communications", icon: MailOpen, label: "Communications", helper: "Parent conversations", group: "Team" },
    { href: "/crm/templates", icon: Newspaper, label: "Message Templates", helper: "Reusable messages", group: "Team" },
    { href: "/crm/settings", icon: Settings, label: "CRM Settings", helper: "Documents & visit slots", group: "Team" },
    { href: "/crm/staff", icon: Users, label: "Staff", helper: "Team access", group: "Team" },
    { href: "/crm/account", icon: UserCog, label: "My Account", helper: "Profile & password", group: "Team" },
  ],
};

export const WORKSPACE = {
  admin: { name: "Content Studio", label: "Website CMS", icon: Activity, switchHref: "/crm", switchLabel: "Open CRM" },
  crm: { name: "School Operations", label: "School CRM", icon: GraduationCap, switchHref: "/admin", switchLabel: "Open CMS" },
} as const;

export function currentItem(mode: WorkspaceMode, pathname: string) {
  const items = NAV[mode];
  return [...items].sort((a, b) => b.href.length - a.href.length).find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? items[0];
}
