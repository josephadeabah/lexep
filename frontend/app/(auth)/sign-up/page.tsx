import { AuthForm } from "@/components/auth-form/auth-form";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export const metadata = {
  title: "Create your account — Lexep",
  description: "Create your Lexep account and start your journey.",
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#fbf9f8]">
      <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Lexep home">
            <Logo size={64} showWordMark={false} />
            <span className="font-sans text-xl font-semibold tracking-[-0.04em]">Lexep</span>
          </Link>
          <Link
            href="/sign-in"
            className="rounded-md border border-[#d0c5af] px-4 py-2 text-sm font-semibold text-[#4d4635] transition hover:bg-white"
          >
            Sign in
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md">
            <AuthForm mode="sign-up" />
          </div>
        </div>

        <footer className="text-center text-xs text-[#7f7663]">© 2026 Lexep</footer>
      </div>
    </main>
  );
}
