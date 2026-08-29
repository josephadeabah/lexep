import { AuthForm } from "@/components/auth-form/auth-form";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export const metadata = {
  title: "Sign in — Lexep",
  description: "Sign in to continue your Lexep journey.",
};

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#fbf9f8]">
      <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Lexep home">
            <Logo size={64} showWordmark={false} />
            <span className="font-sans text-xl font-semibold tracking-[-0.04em]">Lexep</span>
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#241a00] shadow-[0_4px_20px_rgba(115,92,0,0.12)] transition hover:bg-[#e9c349]"
          >
            Create account
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md">
            <AuthForm mode="sign-in" />
          </div>
        </div>

        <footer className="text-center text-xs text-[#7f7663]">© 2026 Lexep</footer>
      </div>
    </main>
  );
}
