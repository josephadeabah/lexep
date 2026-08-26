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
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import Footer from "@/components/layout/Footer";

const FEATURES = [
  {
    icon: GraduationCap,
    eyebrow: "LEARN",
    number: "01",
    title: "Build skills you can use in the real world",
    body: "Move beyond theory with practical learning that helps you build confidence, develop useful skills, and prepare for the opportunities ahead.",
    href: "/explore",
    linkLabel: "Explore learning",
  },
  {
    icon: Users,
    eyebrow: "CONNECT",
    number: "02",
    title: "Learn from people who have walked the path",
    body: "Connect with experienced mentors for career guidance, honest advice, portfolio feedback, and perspective from people who understand the journey.",
    href: "/mentorship",
    linkLabel: "Find a mentor",
  },
  {
    icon: BriefcaseBusiness,
    eyebrow: "EXPERIENCE",
    number: "03",
    title: "Turn what you know into what you can do",
    body: "Discover internships and real-world opportunities where you can apply your skills, gain experience, build your portfolio, and grow your confidence.",
    href: "/opportunities",
    linkLabel: "Browse opportunities",
  },
  {
    icon: Award,
    eyebrow: "GROW",
    number: "04",
    title: "Let opportunity meet your ambition",
    body: "Access grants and community-backed support designed to help promising young people, ideas, and projects take their next meaningful step.",
    href: "/grants",
    linkLabel: "Explore grants",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Start with your ambition",
    body: "Tell Lexep what you are learning, where you want to go, and what you want to build.",
  },
  {
    number: "02",
    title: "Build your path",
    body: "Discover practical learning, mentors, internships, grants, and opportunities that move you closer to your goals.",
  },
  {
    number: "03",
    title: "Turn progress into momentum",
    body: "Gain experience, grow your network, access support, and keep taking meaningful steps toward the future you imagine.",
  },
];

const JOURNEY = [
  {
    label: "Learn",
    icon: GraduationCap,
  },
  {
    label: "Connect",
    icon: Users,
  },
  {
    label: "Experience",
    icon: BriefcaseBusiness,
  },
  {
    label: "Grow",
    icon: Award,
  },
  {
    label: "Build your future",
    icon: Rocket,
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
              href="#journey"
              className="text-body-md text-on-surface-variant transition hover:text-primary"
            >
              Your journey
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
              href="/grants"
              className="text-body-md text-on-surface-variant transition hover:text-primary"
            >
              Grants
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
          {/* Ambient lighting */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-primary-container/15 blur-3xl" />
            <div className="absolute left-1/3 top-1/2 h-72 w-72 rounded-full bg-primary-container/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-surface-tint/5 blur-3xl" />
          </div>

          {/* Noise texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative mx-auto grid max-w-container-max items-center gap-xl px-gutter py-xl lg:grid-cols-[0.95fr_1.05fr] lg:py-2xl">
            {/* Hero copy */}
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-container/20 bg-primary-container/10 px-4 py-2 text-label-md text-primary backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>Built around your ambition</span>
              </div>

              <h1 className="max-w-3xl text-display-lg text-on-background">
                Your ambition deserves
                <br />
                <span className="text-gradient-gold">a path forward.</span>
              </h1>

              <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
                Lexep connects African youth with practical learning, experienced mentors,
                real-world internships, and community-backed support — helping you turn ambition
                into experience, opportunity, and a meaningful future.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/sign-up" size="lg" variant="primary">
                  Start your journey
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button href="/sign-up" size="lg" variant="secondary">
                  Become a mentor
                </Button>
              </div>

              {/* Social proof - avatars placed here, below CTAs */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
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
                  <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                    <span className="text-label-sm font-semibold">+1K</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-label-md text-on-surface">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Trusted Talents</span>
                  </div>
                  <p className="text-label-sm text-on-surface-variant">Across Ghana</p>
                </div>
              </div>

              {/* Journey preview */}
              <div className="mt-10 flex flex-wrap items-center gap-2">
                {["Learn", "Connect", "Experience", "Grow"].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-label-md text-on-surface-variant"
                  >
                    <span className="rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-1.5">
                      {item}
                    </span>

                    {index < 3 && <ArrowRight className="h-4 w-4 text-primary/60" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Opportunity card */}
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-black/60 p-4 text-white shadow-level2 backdrop-blur-xl sm:left-8 sm:right-auto sm:w-[290px] sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                      <BriefcaseBusiness className="h-5 w-5" />
                    </div>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-label-sm">
                      Your next step
                    </span>
                  </div>

                  <p className="text-label-sm text-white/60">Software Engineering Internship</p>

                  <p className="mt-1 text-title-md">Turn your skills into real experience.</p>

                  <div className="mt-4 flex items-center gap-2 text-label-sm text-primary-fixed-dim">
                    Explore opportunities
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Mentorship card */}
                <div className="absolute right-6 top-6 hidden rounded-xl border border-white/20 bg-white/10 p-4 shadow-level2 backdrop-blur-xl sm:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container/20">
                      <HeartHandshake className="h-5 w-5 text-primary-container" />
                    </div>

                    <div>
                      <p className="text-label-sm text-white/70">Guidance when it matters</p>
                      <p className="text-title-md text-white">Connect with a mentor</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 hidden h-32 w-32 rounded-full border border-primary-container/20 bg-primary-container/10 blur-2xl lg:block" />
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary-container/10 blur-2xl" />
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section className="border-y border-outline-variant/30 bg-surface-container-low">
          <div className="mx-auto grid max-w-container-max gap-lg px-gutter py-xl md:grid-cols-3">
            <div>
              <p className="text-gradient-gold text-display-md">More than learning</p>
              <p className="mt-2 text-body-md text-on-surface-variant">
                Build practical skills and understand how to use them beyond the classroom.
              </p>
            </div>

            <div>
              <p className="text-gradient-gold text-display-md">More than a network</p>
              <p className="mt-2 text-body-md text-on-surface-variant">
                Find mentors, peers, and people willing to guide your next step.
              </p>
            </div>

            <div>
              <p className="text-gradient-gold text-display-md">A path forward</p>
              <p className="mt-2 text-body-md text-on-surface-variant">
                Connect learning, experience, opportunities, and community support in one ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* Journey */}
        <section id="journey" className="px-gutter py-2xl">
          <div className="mx-auto max-w-container-max">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 text-label-md font-medium uppercase tracking-[0.18em] text-primary">
                <span className="h-px w-8 bg-primary-container" />
                Your journey
                <span className="h-px w-8 bg-primary-container" />
              </div>

              <h2 className="mt-5 text-headline-lg text-on-background">
                One ambition. An entire ecosystem behind you.
              </h2>

              <p className="mt-4 text-body-lg leading-relaxed text-on-surface-variant">
                Nobody should have to figure out their future alone. Lexep brings together the
                knowledge, guidance, opportunities, and support that help young people keep moving
                forward.
              </p>
            </div>

            <div className="relative mt-xl">
              {/* Connection line */}
              <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-primary-container/40 to-transparent lg:block" />

              <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-5">
                {JOURNEY.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="relative rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 text-center shadow-level1"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                        <Icon className="h-6 w-6" />
                      </div>

                      <p className="mt-5 text-label-sm text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="mt-2 text-title-lg text-on-background">{item.label}</h3>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section
          id="explore"
          className="border-y border-outline-variant/30 bg-surface-container-low px-gutter py-2xl"
        >
          <div className="mx-auto max-w-container-max">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 text-label-md font-medium uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-4 w-4" />
                The Lexep ecosystem
              </div>

              <h2 className="mt-5 text-headline-lg text-on-background">
                Everything you need to keep moving forward.
              </h2>

              <p className="mt-4 text-body-lg text-on-surface-variant">
                Your journey does not end when you finish learning. Every part of Lexep is designed
                to help you take the next meaningful step.
              </p>
            </div>

            <div className="mt-xl grid gap-md md:grid-cols-2">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-level1 transition duration-300 hover:-translate-y-1 hover:shadow-level2"
                  >
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary-container/5 blur-3xl transition group-hover:bg-primary-container/10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                          <Icon className="h-7 w-7" />
                        </div>

                        <span className="text-label-lg text-primary/60">{feature.number}</span>
                      </div>

                      <p className="mt-7 text-label-md font-medium uppercase tracking-[0.15em] text-primary">
                        {feature.eyebrow}
                      </p>

                      <h3 className="mt-3 text-headline-md text-on-background">{feature.title}</h3>

                      <p className="mt-3 max-w-xl text-body-md leading-relaxed text-on-surface-variant">
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
        <section id="how-it-works" className="px-gutter py-2xl">
          <div className="mx-auto max-w-container-max">
            <div className="grid gap-xl lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="inline-flex items-center gap-2 text-label-md font-medium uppercase tracking-[0.18em] text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  How it works
                </div>

                <h2 className="mt-5 max-w-md text-headline-lg text-on-background">
                  From ambition to opportunity, one step at a time.
                </h2>

                <p className="mt-5 max-w-lg text-body-lg leading-relaxed text-on-surface-variant">
                  Whether you are still figuring things out, building your skills, or ready to take
                  your first big opportunity, Lexep helps you find the next step that makes sense
                  for you.
                </p>

                <Button href="/sign-up" size="lg" variant="primary" className="mt-8">
                  Start your journey
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

        {/* Who Lexep is for */}
        <section className="border-y border-outline-variant/30 bg-surface-container-low px-gutter py-2xl">
          <div className="mx-auto max-w-container-max">
            <div className="mb-xl max-w-2xl">
              <p className="text-label-md font-medium uppercase tracking-[0.18em] text-primary">
                Built around a community that moves together
              </p>

              <h2 className="mt-4 text-headline-lg text-on-background">
                Your future is personal. Building it does not have to be lonely.
              </h2>

              <p className="mt-4 text-body-lg leading-relaxed text-on-surface-variant">
                Lexep brings together the people and organisations that can help turn individual
                ambition into shared progress.
              </p>
            </div>

            <div className="grid gap-md md:grid-cols-2 lg:grid-cols-4">
              {/* Learners */}
              <div className="relative overflow-hidden rounded-xl bg-[#1a1a1a] p-lg text-inverse-on-surface">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary-container/10 blur-2xl" />

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <h3 className="mt-8 text-headline-md">For youth</h3>

                  <p className="mt-3 text-body-md leading-relaxed text-[#c9c7c6]">
                    Learn practical skills, find guidance, gain experience, access opportunities,
                    and build toward the future you want.
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

              {/* Mentors */}
              <div className="relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-level1">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                    <HeartHandshake className="h-6 w-6" />
                  </div>

                  <h3 className="mt-8 text-headline-md text-on-background">For mentors</h3>

                  <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
                    Share your experience, guide emerging talent, and become part of someone
                    else&apos;s path forward.
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

              {/* Companies */}
              <div className="relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-level1">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                    <Building2 className="h-6 w-6" />
                  </div>

                  <h3 className="mt-8 text-headline-md text-on-background">For companies</h3>

                  <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
                    Connect with ambitious young talent, create meaningful internships, and help
                    build stronger career pathways.
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

              {/* Community */}
              <div className="relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-level1">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-primary text-on-primary-container shadow-level1">
                    <Award className="h-6 w-6" />
                  </div>

                  <h3 className="mt-8 text-headline-md text-on-background">For supporters</h3>

                  <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
                    Back promising young people, ideas, and projects by helping create access to
                    grants and meaningful opportunities.
                  </p>

                  <Link
                    href="/grants"
                    className="mt-8 inline-flex items-center gap-2 text-label-md text-primary"
                  >
                    Support ambition
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-gutter pb-2xl pt-2xl">
          <div className="relative mx-auto max-w-container-max overflow-hidden rounded-2xl bg-[#1a1a1a]">
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

            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 via-transparent to-transparent" />

            <div className="relative z-10 grid min-h-[460px] items-center px-gutter py-xl md:px-xl">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-fixed-dim/20 bg-primary-fixed-dim/10 px-4 py-2 text-label-md text-primary-fixed-dim backdrop-blur-sm">
                  <Rocket className="h-4 w-4" />
                  Your next step starts here
                </div>

                <h2 className="mt-6 text-headline-lg text-inverse-on-surface">
                  Your ambition deserves more than a dream.
                  <br />
                  <span className="text-primary-fixed-dim">It deserves a path.</span>
                </h2>

                <p className="mt-5 max-w-lg text-body-lg leading-relaxed text-[#c9c7c6]">
                  Learn practical skills. Connect with mentors. Gain real-world experience. Access
                  opportunities and community-backed support. Lexep helps you take the next step —
                  and the one after that.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href="/sign-up" size="lg" variant="primary">
                    Start your journey
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button href="/explore" size="lg" variant="secondary">
                    Explore Lexep
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
