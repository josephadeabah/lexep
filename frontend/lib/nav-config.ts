import type { UserRole } from "./types";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  HandCoins,
  FileText,
  Settings,
  GraduationCap,
  CalendarClock,
  ClipboardList,
  Package,
  Award,
  Bell,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Every route below is role-aware server-side (e.g. /courses renders
// 'Explore Learning Paths' for a learner but 'Curriculum Management' for
// admin/company) — one physical route per concern, no duplicate pages per
// role, and no nav item pointing at a route that doesn't exist for that role.
export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  learner: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Courses", href: "/courses", icon: GraduationCap },
    { label: "Assessments", href: "/assessments", icon: Award },
    { label: "Mentorship", href: "/mentorship", icon: Users },
    { label: "Opportunities", href: "/opportunities", icon: Briefcase },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  mentor: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Requests", href: "/mentorship/requests", icon: ClipboardList },
    { label: "My Packages", href: "/mentorship/packages", icon: Package },
    { label: "Students", href: "/mentorship/students", icon: Users },
    { label: "Grants", href: "/grants", icon: HandCoins },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Resources", href: "/resources", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  company: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Opportunities", href: "/opportunities", icon: Briefcase },
    { label: "Interviews", href: "/interviews", icon: CalendarClock },
    { label: "Courses", href: "/courses", icon: BookOpen },
    { label: "Assessments", href: "/assessments", icon: Award },
    { label: "Mentorship", href: "/mentorship", icon: Users },
    { label: "Grants", href: "/grants", icon: HandCoins },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Opportunities", href: "/opportunities", icon: Briefcase },
    { label: "Courses", href: "/courses", icon: BookOpen },
    { label: "Assessments", href: "/assessments", icon: Award },
    { label: "Grants", href: "/grants", icon: HandCoins },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
};

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Companies", href: "/admin/companies", icon: Briefcase },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Award },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface BrandConfig {
  brand: string;
  tagline: string;
  ctaLabel?: string;
  ctaHref?: string;
  roleLabel: string;
}

export const BRAND_BY_ROLE: Record<UserRole, BrandConfig> = {
  learner: {
    brand: "Lexep",
    tagline: "Student Portal",
    ctaLabel: "Upgrade to Pro",
    ctaHref: "/upgrade?plan=learner_plus",
    roleLabel: "Lexep Architect",
  },
  mentor: {
    brand: "Architect Portal",
    tagline: "Empowering African Youth",
    roleLabel: "Mentor",
  },
  company: {
    brand: "Architect Portal",
    tagline: "Empowering African Youth",
    ctaLabel: "New Application",
    ctaHref: "/opportunities/new",
    roleLabel: "Company",
  },
  admin: {
    brand: "Lexep Admin",
    tagline: "Platform Management",
    roleLabel: "Admin",
  },
};
