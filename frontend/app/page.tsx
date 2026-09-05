import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Users,
  Briefcase,
  Sparkles,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Learn",
    body: "Access industry-relevant courses and skill assessments designed by working architects and engineers. Focus on what employers are actively hiring for.",
  },
  {
    icon: Users,
    title: "Connect",
    body: "Get matched with experienced mentors who review your work, open doors, and help you navigate the first steps of a real career.",
  },
  {
    icon: Briefcase,
    title: "Build",
    body: "Apply what you've learned to real internships with partner companies across the continent — and walk away with a portfolio that proves it.",
  },
];

const AUDIENCES = [
  {
    label: "For Youth",
    title: "Unlock Your Potential",
    points: ["100% free access to all learning paths", "1-on-1 mentorship sessions", "Direct pipeline to internships"],
    cta: "Join as a Student",
    href: "/sign-up",
    dark: false,
  },
  {
    label: "For Mentors",
    title: "Shape the Next Generation",
    points: ["Give back to the community on your schedule", "Build leadership and coaching skills", "Expand your professional network"],
    cta: "Become a Mentor",
    href: "/onboarding/choose-role",
    dark: true,
  },
  {
    label: "For Companies",
    title: "Discover Top Talent",
    points: ["Access a curated pool of vetted candidates", "Reduce hiring time and costs", "Support local tech ecosystem growth"],
    cta: "Partner with Us",
    href: "/sign-up",
    dark: false,
  },
];

const STATS = [
  { value: "10,000+", label: "African youth on Lexep" },
  { value: "500+", label: "Mentorship sessions" },
  { value: "100+", label: "Internships placed" },
  { value: "15+", label: "African countries" },
];

function cnList(dark: boolean) {
  return dark
    ? "flex items-start gap-2 text-body-md text-[#e4e2e2]"
    : "flex items-start gap-2 text-body-md text-on-surface-variant";
}

/** Abstract, text-free architectural motif built from CSS/SVG in the brand
 * palette — used instead of stock photography so the hero has zero
 * copyright risk and never depends on an external asset. */
function HeroMotif() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-inverse-surface">
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: "radial-gradient(circle at 30% 20%, #554300 0%, #1a1a1a 55%, #1a1a1a 100%)" }}
      />
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" fill="none">
        <g stroke="#e9c349" strokeOpacity="0.5" strokeWidth="1.5">
          <path d="M40 360 L40 140 L120 80 L200 140 L200 360" />
          <path d="M120 80 L120 360" />
          <path d="M40 220 L200 220" />
          <path d="M240 360 L240 60 L340 60 L340 360" />
          <path d="M240 140 L340 140" />
          <path d="M240 260 L340 260" />
        </g>
        <g stroke="#e9c349" strokeOpacity="0.9" strokeWidth="2">
          <circle cx="120" cy="80" r="4" fill="#e9c349" />
          <circle cx="340" cy="60" r="4" fill="#e9c349" />
        </g>
        <g stroke="#ffe088" strokeOpacity="0.35" strokeWidth="1">
          <path d="M0 320 L400 280" />
          <path d="M0 380 L400 340" />
        </g>
      </svg>
      <div className="absolute bottom-6 left-6 right-6 rounded-lg bg-black/30 p-4 backdrop-blur-sm">
        <p className="flex items-center gap-2 text-label-md text-inverse-on-surface">
          <Sparkles className="h-4 w-4 text-primary-fixed-dim" /> AI-matched mentors &amp; opportunities
        </p>
        <p className="mt-1 text-label-sm text-[#c9c7c6]">
          Built for the next generation of African builders, designers, and engineers.
        </p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-outline-variant/40">
        <div className="mx-auto flex max-w-container-max items-center justify-between px-gutter py-4">
          <Logo variant="light" size={26} />
          <nav className="hidden items-center gap-lg md:flex">
            <Link href="#explore" className="text-body-md text-on-surface-variant hover:text-primary">
              Explore
            </Link>
            <Link href="/mentorship" className="text-body-md text-on-surface-variant hover:text-primary">
              Mentors
            </Link>
            <Link href="/pricing" className="text-body-md text-on-surface-variant hover:text-primary">
              Pricing
            </Link>
            <Link href="/insights" className="text-body-md text-on-surface-variant hover:text-primary">
              Insights
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button href="/sign-in" variant="ghost">
              Log In
            </Button>
            <Button href="/sign-up" variant="primary">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-gutter py-xl">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at top right, #d4af37, transparent 60%)" }}
        />
        <div className="relative z-10 mx-auto grid max-w-container-max items-center gap-xl md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-fixed px-3 py-1 text-label-sm text-on-primary-fixed-variant">
              <Sparkles className="h-3.5 w-3.5" /> Free during our launch beta
            </span>
            <h1 className="mt-6 text-display-lg text-on-background">
              Architecting the Future of <span className="text-primary-container">African Talent.</span>
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-on-surface-variant">
              Lexep connects ambitious African youth with world-class mentors, real internships, and
              AI-matched opportunities — building the pipeline of architects, engineers, and builders
              shaping the continent&apos;s next generation of cities.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/sign-up" size="lg" variant="primary">
                Start Learning Free <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/onboarding/choose-role" size="lg" variant="secondary">
                Become a Mentor
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" /> AI-matched mentors &amp; roles
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Verified partner companies
              </span>
            </div>
          </div>
          <HeroMotif />
        </div>
      </section>

      <section className="bg-inverse-surface py-lg">
        <div className="mx-auto grid max-w-container-max grid-cols-2 gap-md px-gutter text-center md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-display-lg text-primary-fixed-dim" style={{ fontSize: 36 }}>
                {stat.value}
              </p>
              <p className="mt-1 text-label-sm text-[#c9c7c6]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="explore" className="px-gutter py-xl">
        <div className="mx-auto max-w-container-max">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-headline-lg text-on-background">A Complete Ecosystem for Growth</h2>
            <p className="mt-4 text-body-md text-on-surface-variant">
              Everything you need to transition from learning to earning, all in one seamless platform.
            </p>
          </div>

          <div className="mt-xl grid gap-md md:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card-level1 p-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary-container">
                  <feature.icon className="h-6 w-6 text-on-primary-container" />
                </div>
                <h3 className="text-headline-md text-on-background">{feature.title}</h3>
                <p className="mt-2 text-body-md text-on-surface-variant">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-gutter py-xl">
        <div className="mx-auto max-w-container-max">
          <div className="grid gap-md md:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div
                key={a.label}
                className={
                  a.dark
                    ? "flex flex-col rounded-lg bg-inverse-surface p-md text-inverse-on-surface"
                    : "flex flex-col rounded-lg border border-outline-variant p-md"
                }
              >
                <span className={a.dark ? "text-label-sm text-primary-fixed-dim" : "text-label-sm text-primary"}>
                  {a.label.toUpperCase()}
                </span>
                <h3 className={a.dark ? "mt-2 text-headline-md text-inverse-on-surface" : "mt-2 text-headline-md text-on-background"}>
                  {a.title}
                </h3>
                <ul className="mt-4 flex flex-1 flex-col gap-2">
                  {a.points.map((p) => (
                    <li key={p} className={cnList(a.dark)}>
                      <CheckCircle2 className={a.dark ? "mt-0.5 h-4 w-4 flex-shrink-0 text-primary-fixed-dim" : "mt-0.5 h-4 w-4 flex-shrink-0 text-primary"} />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href={a.href}
                  className={
                    a.dark
                      ? "mt-6 flex items-center gap-1 text-label-md text-primary-fixed-dim hover:underline"
                      : "mt-6 flex items-center gap-1 text-label-md text-primary hover:underline"
                  }
                >
                  {a.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-gutter py-xl">
        <div className="mx-auto flex max-w-container-max flex-col items-center gap-6 rounded-xl bg-[#1a1a1a] px-md py-xl text-center text-inverse-on-surface">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container">
            <Building2 className="h-6 w-6 text-on-primary-container" />
          </span>
          <h2 className="text-headline-lg">Ready to build your future?</h2>
          <p className="max-w-xl text-body-md text-[#c9c7c6]">
            Join thousands of African youth, mentors, and companies shaping the continent&apos;s next
            generation of talent — free during our launch beta.
          </p>
          <Button href="/sign-up" size="lg" variant="primary">
            Create your account <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-outline-variant/40 px-gutter py-md">
        <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-4 text-label-sm text-on-surface-variant md:flex-row">
          <span>© {new Date().getFullYear()} Lexep. All rights reserved.</span>
          <div className="flex gap-md">
            <Link href="/insights" className="hover:text-primary">Insights</Link>
            <Link href="/pricing" className="hover:text-primary">Pricing</Link>
            <Link href="/help" className="hover:text-primary">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
