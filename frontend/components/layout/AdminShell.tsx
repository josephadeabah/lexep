"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { ADMIN_NAV } from "@/lib/nav-config";
import {
  Bell,
  Settings,
  Menu,
  X,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { Sidebar } from "./sidebar/Sidebar";
import { OfflineBanner } from "./OfflineBanner";
import Link from "next/link";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, isInitialized, hydrate, logout } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) hydrate();
  }, [isInitialized, hydrate]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace("/sign-in");
    } else if (user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !user || user.role !== "admin") {
    return <div className="flex h-screen items-center justify-center bg-[#fbf9f8]">Loading…</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#fbfaf8]">
      {/* Sidebar */}
      <Sidebar
        brand="Lexep Admin"
        tagline="Platform Management"
        navItems={ADMIN_NAV}
        ctaLabel="Upgrade to Pro"
        ctaHref="/upgrade"
        userSummary={{
          name: user.full_name,
          roleLabel: "Admin",
          avatarUrl: user.avatar_url,
        }}
        onLogout={() => {
          logout();
          router.replace("/sign-in");
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
      />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Navigation - sticky */}
        <header className="sticky top-0 z-30 flex min-h-20 items-center gap-4 border-b border-[#d8d1c4] bg-[#fbf9f8] px-5 sm:px-8">
          {/* Desktop sidebar toggle */}
          <button
            className="hidden border-0 bg-transparent p-1 text-[#38342d] hover:text-[#735c00] md:block"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={22} /> : <PanelLeftClose size={22} />}
          </button>

          {/* Mobile menu toggle */}
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
              placeholder="Search..."
              className="w-full min-w-0 border-0 bg-transparent text-[16px] outline-none"
            />
          </label>

          <nav
            className="ml-auto flex items-center gap-6 text-[15px]"
            aria-label="Account navigation"
          >
            <a href="#analytics" className="hidden text-[#38342d] hover:text-[#735c00] sm:block">
              Analytics
            </a>
            <a href="#users" className="hidden text-[#38342d] hover:text-[#735c00] sm:block">
              Users
            </a>
            <a href="#help" className="hidden text-[#38342d] hover:text-[#735c00] sm:block">
              Help
            </a>
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
                <Avatar name={user.full_name} size={40} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user.full_name}</span>
                  <span className="text-muted-foreground text-xs">Admin</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="#analytics">Analytics</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#users">Users</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#help">Help</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#profile">Admin Profile</Link>
              </DropdownMenuItem>
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
        <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12">
          <OfflineBanner />
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}