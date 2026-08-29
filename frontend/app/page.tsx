"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AuthForm } from "@/components/auth-form/auth-form";

export default function Page() {
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-up");

  return (
    <main className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c]">
      <header className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 lg:px-12">
        <Link href="/" className="flex items-center gap-2" aria-label="Lexep home">
          <Logo size={64} showWordMark={false} />
          <span className="font-sans text-xl font-semibold tracking-[-0.04em]">Lexep</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-semibold">
          <button
            onClick={() => setAuthMode("sign-in")}
            className="rounded-md px-4 py-2 text-[#4d4635] transition hover:bg-[#efeded]"
          >
            Sign in
          </button>
          <button
            onClick={() => setAuthMode("sign-up")}
            className="rounded-md bg-[#d4af37] px-4 py-2 text-[#241a00] shadow-[0_4px_20px_rgba(115,92,0,0.12)] transition hover:bg-[#e9c349]"
          >
            Get started
          </button>
        </nav>
      </header>

      <section className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 pt-16 pb-24 lg:grid-cols-12 lg:px-12 lg:pt-24 lg:pb-32">
        <div className="lg:col-span-7">
          <p className="mb-6 text-xs font-semibold tracking-[0.18em] text-[#735c00] uppercase">
            A clearer path forward
          </p>
          <h1 className="max-w-3xl font-sans text-5xl leading-[1.08] font-bold tracking-[-0.055em] text-[#1b1c1c] sm:text-6xl lg:text-7xl">
            Build the career you&apos;re meant to lead.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#4d4635]">
            Lexep gives ambitious professionals the structure, insight, and momentum to turn career
            goals into meaningful progress.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setAuthMode("sign-up")}
              className="rounded-md bg-[#735c00] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(115,92,0,0.18)] transition hover:bg-[#554300]"
            >
              Start your journey
            </button>
            <a
              href="#approach"
              className="rounded-md border border-[#d0c5af] px-6 py-3.5 text-sm font-semibold text-[#4d4635] transition hover:bg-white"
            >
              See how it works
            </a>
          </div>
          <p className="mt-5 text-xs text-[#7f7663]">
            Designed for the next generation of African professionals.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-[#303031] p-6 text-white shadow-[0_18px_50px_rgba(48,48,49,0.14)] sm:p-8 lg:col-span-5">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#e9c349] uppercase">
                Start here
              </p>
              <h2 className="mt-2 font-sans text-2xl font-semibold tracking-[-0.04em]">
                Your next move.
              </h2>
            </div>
            <Logo size={34} showWordMark={false} />
          </div>

          {/* Mode Toggle */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-md bg-[#454546] p-1 text-sm font-semibold">
            <button
              onClick={() => setAuthMode("sign-up")}
              className={`rounded px-3 py-2 text-center transition ${
                authMode === "sign-up"
                  ? "bg-[#d4af37] text-[#241a00]"
                  : "text-[#d7d2c8] hover:bg-[#555556]"
              }`}
            >
              Create account
            </button>
            <button
              onClick={() => setAuthMode("sign-in")}
              className={`rounded px-3 py-2 text-center transition ${
                authMode === "sign-in"
                  ? "bg-[#d4af37] text-[#241a00]"
                  : "text-[#d7d2c8] hover:bg-[#555556]"
              }`}
            >
              Sign in
            </button>
          </div>

          {/* Auth Form */}
          <AuthForm mode={authMode} />
        </div>
      </section>

      <section id="approach" className="border-y border-[#e4e2e2] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-12 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#735c00] uppercase">
                The Lexep approach
              </p>
              <h2 className="mt-4 font-sans text-3xl leading-tight font-semibold tracking-[-0.04em]">
                Progress feels different when it has direction.
              </h2>
            </div>
            <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8 lg:gap-8">
              {[
                ["01", "Know your edge", "Clarify your strengths and make your value visible."],
                ["02", "Shape your path", "Build practical skills around the future you want."],
                ["03", "Move with intent", "Make confident decisions and keep momentum."],
              ].map(([number, title, copy]) => (
                <article key={number} className="border-t-2 border-[#d4af37] pt-5">
                  <p className="font-mono text-xs text-[#735c00]">{number}</p>
                  <h3 className="mt-4 font-sans text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5f5e5e]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20 lg:px-12 lg:py-28">
        <div className="flex flex-col items-start justify-between gap-8 rounded-xl bg-[#303031] px-7 py-10 text-white sm:px-12 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#e9c349] uppercase">
              Your next chapter starts here
            </p>
            <h2 className="mt-4 max-w-xl font-sans text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Make your ambition practical.
            </h2>
          </div>
          <button
            onClick={() => {
              setAuthMode("sign-up");
              document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="shrink-0 rounded-md bg-[#d4af37] px-6 py-3.5 text-sm font-semibold text-[#241a00] transition hover:bg-[#e9c349]"
          >
            Create your account
          </button>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1280px] items-center justify-between border-t border-[#e4e2e2] px-6 py-7 text-xs text-[#7f7663] lg:px-12">
        <span>© 2026 Lexep</span>
        <span>Career development, with direction.</span>
      </footer>
    </main>
  );
}
