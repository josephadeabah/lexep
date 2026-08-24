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
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  learner: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Courses", href: "/courses", icon: GraduationCap },
    { label: "Assessments", href: "/assessments", icon: Award },
    { label: "Mentorship", href: "/mentorship", icon: Users },
    { label: "Opportunities", href: "/opportunities", icon: Briefcase },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  mentor: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Requests", href: "/mentorship/requests", icon: ClipboardList },
    { label: "My Packages", href: "/mentorship/packages", icon: Package },
    { label: "Students", href: "/mentorship/students", icon: Users },
    { label: "Grants", href: "/grants", icon: HandCoins },
    { label: "Resources", href: "/resources", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  company: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Opportunities", href: "/opportunities", icon: Briefcase },
    { label: "Interviews", href: "/interviews", icon: CalendarClock },
    { label: "Mentorship", href: "/mentorship", icon: Users },
    { label: "Grants", href: "/grants", icon: HandCoins },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Opportunities", href: "/opportunities", icon: Briefcase },
    { label: "Grants", href: "/grants", icon: HandCoins },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
};

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Companies", href: "/admin/companies", icon: Briefcase },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Award },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
