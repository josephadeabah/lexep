"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, LogOut, type LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { Logo } from "@/components/ui/Logo";
import type { NavItem } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
}

interface SidebarProps {
  brand?: string;
  tagline?: string;
  navItems: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  sidebarBottom?: SidebarItem[];
  userSummary?: { name: string; roleLabel: string; avatarUrl?: string | null };
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

export function Sidebar({
  brand = "Architect Portal",
  tagline = "Empowering African Youth",
  navItems,
  ctaLabel = "Upgrade to Pro",
  ctaHref = "/upgrade",
  sidebarBottom = [],
  userSummary,
  onLogout,
  isOpen = false,
  onClose,
  isCollapsed = false,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Scrim */}
      {isOpen && (
        <button
          className="fixed inset-0 z-40 border-0 bg-black/45 md:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-[#1a1a1a] text-[#bdbbb8] sticky top-0 flex h-screen flex-col overflow-y-auto",
          "transition-all duration-300 ease-in-out",
          // Desktop - collapse/expand
          "hidden md:flex",
          isCollapsed
            ? "w-0 flex-[0_0_0] overflow-hidden opacity-0"
            : "w-[350px] flex-[0_0_350px] opacity-100",
          // Mobile - always fixed
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:flex max-md:w-[285px] max-md:max-w-[86vw]",
          "max-md:-translate-x-full max-md:transition-transform max-md:duration-250",
          isOpen && "max-md:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-4 px-8 py-8 whitespace-nowrap">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
            <Logo variant="light" size={64} showWordmark={false} />
          </div>
          <div className={cn("transition-opacity duration-200", isCollapsed && "hidden opacity-0")}>
            <strong className="block font-serif text-xl font-bold text-[#f4d36a]">
              {brand}
            </strong>
            <span className="mt-0.5 block text-sm text-[#8a8682]">
              {tagline}
            </span>
          </div>
        </div>

        {/* User Summary */}
        {userSummary && (
          <div
            className={cn(
              "mx-8 mb-4 flex items-center gap-3 rounded-lg bg-white/5 p-3 whitespace-nowrap",
              isCollapsed && "hidden"
            )}
          >
            <Avatar name={userSummary.name} src={userSummary.avatarUrl} size={36} />
            <div className="min-w-0">
              <p className="truncate font-semibold text-[#f4d36a]">
                {userSummary.name}
              </p>
              <p className="truncate text-sm text-[#8a8682]">
                {userSummary.roleLabel}
              </p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        {ctaLabel && (
          <div className={cn("mx-8 my-4 whitespace-nowrap", isCollapsed && "hidden")}>
            <Link
              href={ctaHref || "#"}
              className="flex h-11 w-full items-center justify-center rounded-md bg-[#ddb839] font-bold text-[#171717] transition-colors hover:bg-[#c9a32e]"
            >
              {ctaLabel}
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex w-full items-center gap-[18px] border-l-[5px] border-transparent px-[30px] py-[19px] text-[18px] whitespace-nowrap transition-colors",
                  active
                    ? "bg-[#2a2a2a] text-[#f4d36a] border-l-[#f4d36a] font-bold"
                    : "text-[#8a8682] hover:bg-[#2a2a2a]/50 hover:text-[#bdbbb8]",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Icon size={21} className="flex-shrink-0" />
                <span className={cn("transition-opacity duration-200", isCollapsed && "hidden")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col px-[30px] pb-8 whitespace-nowrap">
          {sidebarBottom.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href || "#"}
                className={cn(
                  "text-[#8a8682] hover:bg-[#2a2a2a]/50 hover:text-[#bdbbb8] flex w-full items-center gap-[18px] border-l-[5px] border-transparent px-0 py-[19px] text-[18px] transition-colors",
                  isCollapsed && "justify-center px-0"
                )}
              >
                {Icon && <Icon size={21} className="flex-shrink-0" />}
                <span className={cn("transition-opacity duration-200", isCollapsed && "hidden")}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          <Link
            href="/help"
            className={cn(
              "text-[#8a8682] hover:bg-[#2a2a2a]/50 hover:text-[#bdbbb8] flex w-full items-center gap-[18px] border-l-[5px] border-transparent px-0 py-[19px] text-[18px] transition-colors",
              isCollapsed && "justify-center px-0"
            )}
          >
            <HelpCircle size={21} className="flex-shrink-0" />
            <span className={cn("transition-opacity duration-200", isCollapsed && "hidden")}>
              Help Center
            </span>
          </Link>

          <button
            onClick={onLogout}
            className={cn(
              "text-[#8a8682] hover:bg-[#2a2a2a]/50 hover:text-[#bdbbb8] flex w-full items-center gap-[18px] border-l-[5px] border-transparent px-0 py-[19px] text-[18px] transition-colors",
              isCollapsed && "justify-center px-0"
            )}
          >
            <LogOut size={21} className="flex-shrink-0" />
            <span className={cn("transition-opacity duration-200", isCollapsed && "hidden")}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}