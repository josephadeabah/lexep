import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Menu,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const FEATURES = [
  {
    icon: GraduationCap,
    eyebrow: "LEARN",
    title: "Build skills that employers value",
    body: "Discover practical learning paths designed to help you move beyond theory and develop skills you can actually use.",
    href: "/explore",
    linkLabel: "Explore learning",
  },
  {
    icon: Users,
    eyebrow: "CONNECT",
    title: "Learn from people ahead of you",
    body: "Connect with experienced professionals for career guidance, portfolio reviews, technical advice, and real-world perspective.",
    href: "/mentorship",
    linkLabel: "Find a mentor",
  },
  {
    icon: BriefcaseBusiness,
    eyebrow: "EXPERIENCE",
    title: "Turn potential into real experience",
    body: "Discover internship opportunities where you can apply your skills, gain workplace experience, and start building your career.",
    href: "/opportunities",
    linkLabel: "Browse opportunities",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your profile",
    body: "Tell us about your skills, interests, goals, and the direction you want your career to take.",
  },
  {
    number: "02",
    title: "Discover your next opportunity",
    body: "Explore relevant mentorship, internships, learning opportunities, and career support.",
  },
  {
    number: "03",
    title: "Build real momentum",
    body: "Gain experience, grow your network, and develop a stronger path toward meaningful work.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-on-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-outline-variant/20 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-container-max items-center justify-between px-gutter py-4">
          <Link href="/" className="shrink-0" aria-label="Lexep home">
            <Logo variant="light" size={56} />
          </Link>

          <nav className="hidden items-center gap-lg lg:flex">
            <Link
              href="#how-it-works"
              className="text-body-md text-on-surface-variant transition hover:text-primary"
            >
              How it works
            </Link>

            <Link
              href="#explore"
              className="text-body-md text-on-surface-variant transition hover:text-primary"
            >
              Explore
            </Link>

            <Link
              href="/mentorship"
              className="text-body-md text-on-surface-variant transition hover:text-primary"
            >
              Mentors
            </Link>

            <Link
              href="/opportunities"
              className="text-body-md text-on-surface-variant transition hover:text-primary"
            >
              Opportunities
            </Link>

            <Link
              href="/pricing"
              className="text-body-md text-on-surface-variant transition hover:text-primary"
            >
              Pricing
            </Link>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <Button href="/sign-in" variant="ghost">
              Log In
            </Button>

            <Button href="/sign-up" variant="primary">
              Get Started
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant/50 text-on-surface lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Ambient lighting layers */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-primary-container/15 blur-3xl" />
            <div className="absolute left-1/3 top-1/2 h-72 w-72 rounded-full bg-primary-container/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-surface-tint/5 blur-3xl" />
          </div>

          {/* Noise overlay */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative mx-auto grid max-w-container-max items-center gap-xl px-gutter py-xl lg:grid-cols-[0.95fr_1.05fr] lg:py-2xl">
            {/* Hero copy */}
            <div className="relative z-10">
              {/* Premium badge with glow */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-container/20 bg-primary-container/10 px-4 py-2 text-label-md text-primary backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>Built for Africa&apos;s next generation</span>
              </div>

              <h1 className="max-w-3xl text-display-lg text-on-background">
                Stop waiting for a job.
                <br />
                <span className="text-gradient-gold">Start building a career.</span>
              </h1>

              <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
                Lexep connects ambitious young Africans with practical skills, experienced mentors,
                and real opportunities to gain the experience employers are looking for.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/sign-up" size="lg" variant="primary">
                  Start building your career
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button href="/onboarding/choose-role" size="lg" variant="secondary">
                  Become a mentor
                </Button>
              </div>

              {/* Trust / social proof */}
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <div className="flex -space-x-3">
                  {["1", "2", "3", "4"].map((person) => (
                    <div
                      key={person}
                      className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-surface bg-surface-container-high shadow-level1"
                    >
                      <Image
                        src={`/images/avatar-${person}.png`}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-headline-sm text-on-background">10,000+</p>
                  <p className="text-label-md text-on-surface-variant">
                    young Africans building their future
                  </p>
                </div>
              </div>
            </div>

            {/* Hero visual composition */}
            <div className="relative">
              <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-surface-container-high shadow-level2 sm:min-h-[520px]">
                <Image
                  src="/images/lexep-hero.png"
                  alt="Young African professionals collaborating and learning together"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating internship card with glass effect */}
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-black/60 p-4 text-white backdrop-blur-xl shadow-level2 sm:left-8 sm:right-auto sm:w-[280px] sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                      <BriefcaseBusiness className="h-5 w-5" />
                    </div>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-label-sm">
                      New opportunity
                    </span>
                  </div>

                  <p className="text-label-sm text-white/60">Software Engineering Intern</p>

                  <p className="mt-1 text-title-md">Start gaining real experience.</p>

                  <div className="mt-4 flex items-center gap-2 text-label-sm text-primary-fixed-dim">
                    Explore opportunities
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Floating glass card */}
                <div className="absolute top-6 right-6 hidden rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl shadow-level2 sm:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container/20">
                      <CheckCircle2 className="h-5 w-5 text-primary-container" />
                    </div>
                    <div>
                      <p className="text-label-sm text-white/70">Mentorship Match</p>
                      <p className="text-title-md text-white">92% success rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow accents */}
              <div className="absolute -bottom-8 -left-8 hidden h-32 w-32 rounded-full border border-primary-container/20 bg-primary-container/10 blur-2xl lg:block" />
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary-container/10 blur-2xl" />
            </div>
          </div>
        </section>

        {/* Problem / positioning */}
        <section className="border-y border-outline-variant/30 bg-surface-container-low">
          <div className="mx-auto grid max-w-container-max gap-lg px-gutter py-xl md:grid-cols-3">
            <div>
              <p className="text-display-md text-gradient-gold">300K+</p>
              <p className="mt-2 text-body-md text-on-surface-variant">
                graduates enter Ghana&apos;s job market every year.
              </p>
            </div>

            <div>
              <p className="text-display-md text-gradient-gold">Skills + Experience</p>
              <p className="mt-2 text-body-md text-on-surface-variant">
                are what turn education into career readiness.
              </p>
            </div>

            <div>
              <p className="text-display-md text-gradient-gold">One platform</p>
              <p className="mt-2 text-body-md text-on-surface-variant">
                to connect learning, mentorship, and opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section id="explore" className="px-gutter py-2xl">
          <div className="mx-auto max-w-container-max">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 text-label-md font-medium uppercase tracking-[0.18em] text-primary">
                <span className="h-px w-8 bg-primary-container" />
                The Lexep ecosystem
                <span className="h-px w-8 bg-primary-container" />
              </div>

              <h2 className="mt-5 text-headline-lg text-on-background">
                Everything you need to move from ambition to opportunity.
              </h2>

              <p className="mt-4 text-body-lg text-on-surface-variant">
                Your career journey does not end when you finish learning. Lexep helps you keep
                moving forward.
              </p>
            </div>

            <div className="mt-xl grid gap-md lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-level1 transition duration-300 hover:-translate-y-1 hover:shadow-level2"
                  >
                    {/* Glass highlight effect */}
                    <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary-container/5 blur-2xl transition group-hover:bg-primary-container/10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                        <Icon className="h-7 w-7" />
                      </div>

                      <p className="mt-7 text-label-md font-medium uppercase tracking-[0.15em] text-primary">
                        {feature.eyebrow}
                      </p>

                      <h3 className="mt-3 text-headline-md text-on-background">{feature.title}</h3>

                      <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
                        {feature.body}
                      </p>

                      <Link
                        href={feature.href}
                        className="mt-7 inline-flex items-center gap-2 text-label-md text-primary transition hover:gap-3"
                      >
                        {feature.linkLabel}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-y border-outline-variant/30 bg-surface-container-low"
        >
          <div className="mx-auto max-w-container-max px-gutter py-2xl">
            <div className="grid gap-xl lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="inline-flex items-center gap-2 text-label-md font-medium uppercase tracking-[0.18em] text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  How it works
                </div>

                <h2 className="mt-5 max-w-md text-headline-lg text-on-background">
                  A clearer path from where you are to where you want to be.
                </h2>

                <p className="mt-5 max-w-lg text-body-lg leading-relaxed text-on-surface-variant">
                  Whether you are still learning, looking for guidance, or ready for your first real
                  opportunity, Lexep helps you take the next meaningful step.
                </p>

                <Button href="/sign-up" size="lg" variant="primary" className="mt-8">
                  Create your free account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                {STEPS.map((step) => (
                  <div
                    key={step.number}
                    className="flex gap-5 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-lg shadow-level1 transition hover:shadow-level2"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-container to-primary text-label-lg font-semibold text-on-primary-container shadow-level1">
                      {step.number}
                    </span>

                    <div>
                      <h3 className="text-title-lg text-on-background">{step.title}</h3>

                      <p className="mt-2 text-body-md leading-relaxed text-on-surface-variant">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* For ecosystem */}
        <section className="px-gutter py-2xl">
          <div className="mx-auto max-w-container-max">
            <div className="mb-xl max-w-2xl">
              <p className="text-label-md font-medium uppercase tracking-[0.18em] text-primary">
                Built for everyone shaping the future
              </p>

              <h2 className="mt-4 text-headline-lg text-on-background">
                More than a platform for learners.
              </h2>
            </div>

            <div className="grid gap-md md:grid-cols-3">
              {/* Dark glass card */}
              <div className="relative overflow-hidden rounded-xl bg-[#1a1a1a] p-lg text-inverse-on-surface">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary-container/10 blur-2xl" />
                
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <h3 className="mt-8 text-headline-md">For learners</h3>

                  <p className="mt-3 text-body-md leading-relaxed text-[#c9c7c6]">
                    Build practical skills, find mentors, discover internships, and start developing a
                    career you are proud of.
                  </p>

                  <Link
                    href="/sign-up"
                    className="mt-8 inline-flex items-center gap-2 text-label-md text-primary-fixed-dim"
                  >
                    Start your journey
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Glass card with highlight */}
              <div className="relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-level1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                    <HeartHandshake className="h-6 w-6" />
                  </div>

                  <h3 className="mt-8 text-headline-md text-on-background">For mentors</h3>

                  <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
                    Share what you have learned, guide emerging talent, and make your professional
                    experience matter beyond your workplace.
                  </p>

                  <Link
                    href="/mentorship"
                    className="mt-8 inline-flex items-center gap-2 text-label-md text-primary"
                  >
                    Become a mentor
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Glass card with highlight */}
              <div className="relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-level1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                    <Building2 className="h-6 w-6" />
                  </div>

                  <h3 className="mt-8 text-headline-md text-on-background">For companies</h3>

                  <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
                    Build a stronger talent pipeline by connecting with motivated young people ready
                    to gain real workplace experience.
                  </p>

                  <Link
                    href="/company"
                    className="mt-8 inline-flex items-center gap-2 text-label-md text-primary"
                  >
                    Partner with Lexep
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-gutter pb-2xl">
          <div className="relative mx-auto max-w-container-max overflow-hidden rounded-2xl bg-[#1a1a1a]">
            {/* Background image with gradient */}
            <div className="absolute inset-0">
              <Image
                src="/images/lexep-community.png"
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-left opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/95 to-[#1a1a1a]/75" />
            </div>

            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 via-transparent to-transparent" />

            <div className="relative z-10 grid min-h-[430px] items-center px-gutter py-xl md:px-xl">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-fixed-dim/20 bg-primary-fixed-dim/10 px-4 py-2 text-label-md text-primary-fixed-dim backdrop-blur-sm">
                  <Award className="h-4 w-4" />
                  Your next step starts here
                </div>

                <h2 className="mt-6 text-headline-lg text-inverse-on-surface">
                  The future you want will not build itself.
                </h2>

                <p className="mt-5 max-w-lg text-body-lg leading-relaxed text-[#c9c7c6]">
                  Join a growing community of ambitious young Africans learning, connecting, gaining
                  experience, and creating better possibilities for themselves.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href="/sign-up" size="lg" variant="primary">
                    Create your free account
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button href="/opportunities" size="lg" variant="secondary">
                    Explore opportunities
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#101010] text-inverse-on-surface">
        <div className="mx-auto max-w-container-max px-gutter py-xl">
          <div className="grid gap-xl md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <Logo variant="dark" size={64} />

              <p className="mt-5 max-w-xs text-body-md leading-relaxed text-[#a8a6a5]">
                Connecting African talent with the skills, people, and opportunities needed to build
                meaningful careers.
              </p>
            </div>

            <div>
              <p className="text-label-md font-semibold text-primary-fixed-dim">Platform</p>

              <div className="mt-4 flex flex-col gap-3 text-body-md text-[#c9c7c6]">
                <Link href="#explore" className="hover:text-white">
                  Explore
                </Link>
                <Link href="/mentorship" className="hover:text-white">
                  Mentors
                </Link>
                <Link href="/opportunities" className="hover:text-white">
                  Opportunities
                </Link>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </div>
            </div>

            <div>
              <p className="text-label-md font-semibold text-primary-fixed-dim">Company</p>

              <div className="mt-4 flex flex-col gap-3 text-body-md text-[#c9c7c6]">
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
                <Link href="/careers" className="hover:text-white">
                  Careers
                </Link>
                <Link href="/insights" className="hover:text-white">
                  Insights
                </Link>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <p className="text-label-md font-semibold text-primary-fixed-dim">Support</p>

              <div className="mt-4 flex flex-col gap-3 text-body-md text-[#c9c7c6]">
                <Link href="/help" className="hover:text-white">
                  Help Center
                </Link>
                <Link href="/guides" className="hover:text-white">
                  Guides
                </Link>
                <Link href="/community" className="hover:text-white">
                  Community
                </Link>
                <Link href="/contact" className="hover:text-white">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-xl flex flex-col justify-between gap-4 border-t border-white/10 pt-md text-label-sm text-[#a8a6a5] md:flex-row">
            <span>© {new Date().getFullYear()} Lexep. All rights reserved.</span>

            <div className="flex flex-wrap gap-5">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>

              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>

              <Link href="/contact" className="hover:text-white">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}