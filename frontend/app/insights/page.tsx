import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const STATS = [
  { value: "500+", label: "Mentorship Sessions" },
  { value: "100+", label: "Internships Placed" },
  { value: "15+", label: "African Countries" },
  { value: "50+", label: "Partner Firms" },
];

export default function InsightsPage() {
  return (
    <div className="bg-background min-h-screen">
      <header className="border-b border-[#d8d1c4]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 lg:px-12">
          <Link href="/" className="flex items-center gap-2" aria-label="Lexep home">
            <Logo size={64} showWordmark={false} />
            <span className="font-sans text-xl font-semibold tracking-[-0.04em]">Lexep</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-semibold text-[#6d6a66] transition hover:text-[#735c00]"
            >
              Explore
            </Link>
            <Link
              href="/mentorship"
              className="text-sm font-semibold text-[#6d6a66] transition hover:text-[#735c00]"
            >
              Mentors
            </Link>
            <Link
              href="/opportunities"
              className="text-sm font-semibold text-[#6d6a66] transition hover:text-[#735c00]"
            >
              Projects
            </Link>
            <Link
              href="/insights"
              className="border-b-2 border-[#d4af37] pb-0.5 text-sm font-semibold text-[#1b1c1c]"
            >
              Insights
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button href="/sign-in" variant="secondary">
              Sign In
            </Button>
            <Button href="/sign-up" variant="primary">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-12 lg:py-24">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-[#735c00] uppercase">
            Insights
          </p>
          <h1 className="font-sans text-4xl font-bold tracking-[-0.055em] text-[#1b1c1c] sm:text-5xl lg:text-6xl">
            Stories of <span className="text-[#d4af37]">Impact</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-[#5f5e5e]">
            Discover how Lexep is shaping the future of African architecture by connecting ambitious
            learners with world-class mentors. These are the journeys of visionaries redefining the
            built environment.
          </p>
          <Button href="#spotlight" size="lg" className="mt-8">
            Read Featured Story
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#d8d1c4] bg-[#303031] shadow-[0_18px_50px_rgba(48,48,49,0.14)]">
          <div className="relative flex aspect-square items-center justify-center">
            <Image
              src="/images/lexep-community.png"
              alt="Africa Builds Future: Careers in Architecture & Design"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 p-8 text-center">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#e9c349] uppercase">
                Featured
              </p>
              <h2 className="mt-4 font-sans text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                Africa Builds Future: Careers in Architecture &amp; Design
              </h2>
              <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-[#d4af37]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1b1c1c] py-16">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-6 text-center lg:grid-cols-4 lg:px-12">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-sans text-4xl font-bold tracking-[-0.04em] text-[#d4af37] sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs font-semibold tracking-wider text-[#c9c7c6] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="spotlight" className="mx-auto max-w-[1280px] px-6 py-20 lg:px-12 lg:py-24">
        <p className="mb-4 text-center text-xs font-semibold tracking-[0.18em] text-[#735c00] uppercase">
          Featured Story
        </p>
        <h2 className="text-center font-sans text-3xl font-semibold tracking-[-0.04em] text-[#1b1c1c] sm:text-4xl">
          Spotlight Journey
        </h2>
        <div className="mt-12 grid gap-8 rounded-xl border border-[#d8d1c4] bg-white p-8 md:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-lg md:aspect-auto">
            <Image
              src="/images/professional.jpg"
              alt="Amara N. on site"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="flex w-fit items-center gap-1 rounded-full bg-[#f7edc9] px-3 py-1 text-xs font-semibold text-[#735c00]">
              <Star className="h-3 w-3" /> Featured Learner
            </span>
            <h3 className="mt-4 font-sans text-2xl font-semibold tracking-[-0.04em] text-[#1b1c1c]">
              From Studio to Leading Sustainable Urban Projects
            </h3>
            <blockquote className="mt-4 border-l-2 border-[#d4af37] pl-4 text-[#5f5e5e] italic">
              &ldquo;Lexep didn&apos;t just give me knowledge; it gave me the network and confidence
              to pitch my sustainable housing concept to a major firm in Nairobi. The mentorship was
              a game-changer.&rdquo;
            </blockquote>
            <p className="mt-4 font-semibold text-[#1b1c1c]">Amara N.</p>
            <p className="text-sm text-[#6d6a66]">Junior Architect at EcoBuild Africa</p>
            <Link
              href="/mentorship"
              className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#735c00] transition hover:text-[#554300] hover:underline"
            >
              Read Full Story <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d8d1c4] bg-[#1b1c1c] px-6 py-8 text-[#c9c7c6] lg:px-12">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Logo size={32} showWordmark={false} />
            <span className="text-sm font-semibold text-[#d4af37]">Lexep</span>
          </div>
          <span className="text-xs text-[#c9c7c6]">
            © {new Date().getFullYear()} Lexep. Shaping African Architecture.
          </span>
          <div className="flex gap-6 text-xs">
            <Link href="#" className="transition hover:text-[#d4af37]">
              Privacy Policy
            </Link>
            <Link href="#" className="transition hover:text-[#d4af37]">
              Terms of Service
            </Link>
            <Link href="/help" className="transition hover:text-[#d4af37]">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
