"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { NAV_BY_ROLE, ADMIN_NAV } from "@/lib/nav-config";
import {
  Bell,
  Settings,
  Menu,
  X,
  Search,
  ShieldCheck,
  Compass,
  FileText,
  Bookmark,
  Briefcase,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { OfflineBanner } from "./OfflineBanner";
import Link from "next/link";
import type { UserRole } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import { HelpCircle, LogOut } from "lucide-react";
import { Sidebar } from "./sidebar/Sidebar";
import { cn } from "@/lib/utils";

const BRAND_BY_ROLE: Record<
  UserRole,
  { brand: string; tagline: string; ctaLabel?: string; ctaHref?: string; roleLabel: string }
> = {
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
    ctaLabel: "Upgrade to Pro",
    ctaHref: "/upgrade?plan=mentor_pro",
    roleLabel: "Mentor",
  },
  company: {
    brand: "Architect Portal",
    tagline: "Empowering African Youth",
    ctaLabel: "Upgrade Plan",
    ctaHref: "/upgrade",
    roleLabel: "Company",
  },
  admin: {
    brand: "Lexep Admin",
    tagline: "Platform Management",
    ctaLabel: "Upgrade to Pro",
    ctaHref: "/upgrade",
    roleLabel: "Admin",
  },
};

const HEADER_LINKS_BY_ROLE: Record<
  UserRole,
  { label: string; href: string; icon?: React.ComponentType<{ size?: number }> }[]
> = {
  learner: [
    { label: "Browse", href: "/opportunities", icon: Compass },
    { label: "Applications", href: "/applications", icon: FileText },
    { label: "Saved", href: "/saved", icon: Bookmark },
    { label: "Help", href: "/help", icon: HelpCircle },
  ],
  mentor: [
    { label: "Analytics", href: "#analytics" },
    { label: "Learners", href: "#learners" },
    { label: "Help", href: "/help" },
  ],
  company: [
    { label: "Analytics", href: "#analytics" },
    { label: "Talent Pool", href: "#talent" },
    { label: "Help", href: "/help" },
  ],
  admin: [
    { label: "Admin Settings", href: "#admin-settings" },
    { label: "Profile", href: "#profile" },
  ],
};

const SIDEBAR_BOTTOM_BY_ROLE: Record<
  UserRole,
  {
    label: string;
    icon?: React.ComponentType<{ size?: number }>;
    href?: string;
    onClick?: () => void;
  }[]
> = {
  learner: [],
  mentor: [],
  company: [{ label: "Post Internship", href: "/opportunities/new", icon: Briefcase }],
  admin: [{ label: "System Status", href: "#system-status", icon: ShieldCheck }],
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isInitialized, hydrate, logout } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) hydrate();
  }, [isInitialized, hydrate]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace("/sign-in");
    } else if (user.role === "admin") {
      router.replace("/admin/applications");
    } else if (!user.role) {
      router.replace("/onboarding/choose-role");
    } else if (!user.onboarding_completed) {
      router.replace(`/onboarding/${user.role}`);
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !user || !user.role) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fbf9f8]">
        Loading your workspace…
      </div>
    );
  }

  const role = user.role;
  const brandConfig = BRAND_BY_ROLE[role];
  const navItems = role === "admin" ? ADMIN_NAV : NAV_BY_ROLE[role];
  const headerLinks = HEADER_LINKS_BY_ROLE[role] || [];
  const sidebarBottom = SIDEBAR_BOTTOM_BY_ROLE[role] || [];

  return (
    <div className="flex min-h-screen bg-[#fbfaf8]">
      {/* Sidebar */}
      <Sidebar
        brand={brandConfig.brand}
        tagline={brandConfig.tagline}
        navItems={navItems}
        ctaLabel={brandConfig.ctaLabel}
        ctaHref={brandConfig.ctaHref}
        sidebarBottom={sidebarBottom}
        userSummary={{
          name: user.full_name,
          roleLabel: brandConfig.roleLabel,
          avatarUrl: user.avatar_url,
        }}
        onLogout={() => {
          logout();
          router.replace("/sign-in");
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Top Navigation */}
        <header className="flex min-h-[80px] items-center gap-4 border-b border-[#d8d1c4] px-5 sm:px-8">
          <button
            className="grid place-items-center border-0 bg-transparent p-1 md:hidden"
            aria-label={sidebarOpen ? "Close dashboard menu" : "Open dashboard menu"}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <label className="flex h-11 w-full max-w-[320px] flex-1 items-center gap-3 rounded-md border border-[#cbbfae] bg-white px-4">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search</span>
            <input
              placeholder="Search internships..."
              className="w-full min-w-0 border-0 bg-transparent text-[16px] outline-none"
            />
          </label>

          {/* Nav Links */}
          <nav
            className="ml-auto flex items-center gap-1 text-[15px]"
            aria-label="Account navigation"
          >
            {headerLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "hidden rounded-md px-3 py-2 text-sm font-semibold transition sm:block",
                    isActive
                      ? "border-b-2 border-[#d4af37] text-[#1b1c1c]"
                      : "text-[#6d6a66] hover:text-[#1b1c1c]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            className="grid place-items-center border-0 bg-transparent p-1 text-[#38342d]"
            aria-label="Notifications"
          >
            <Bell size={22} />
          </button>

          <button
            className="hidden border-0 bg-transparent p-1 text-[#38342d] sm:grid"
            aria-label="Settings"
          >
            <Settings size={22} />
          </button>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="profile-avatar" aria-label="Open profile menu">
                <Avatar name={user.full_name} src={user.avatar_url} size={40} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user.full_name}</span>
                  <span className="text-muted-foreground text-xs">{brandConfig.roleLabel}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {headerLinks.map((link) => (
                <DropdownMenuItem key={link.label} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => {
                  logout();
                  router.replace("/sign-in");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className="px-4 py-8 sm:px-8 sm:py-12">
          <OfflineBanner />
          <div className="mx-auto w-full max-w-[1280px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
