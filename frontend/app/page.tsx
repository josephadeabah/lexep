import Link from "next/link";
import { ArrowRight, GraduationCap, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Skill-First Learning",
    body: "Access industry-relevant courses designed by experts. Focus on practical skills that employers are actively looking for today.",
  },
  {
    icon: Users,
    title: "1:1 Mentorship",
    body: "Get matched with experienced mentors who provide guidance, review your work, and help navigate your career path.",
  },
  {
    icon: Briefcase,
    title: "Real Internships",
    body: "Apply your skills to real-world projects and secure internships with partner companies to launch your professional journey.",
  },
];

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

      <section className="relative flex min-h-[70vh] items-center overflow-hidden px-gutter py-xl">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at top right, #d4af37, transparent 60%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-container-max">
          <div className="max-w-2xl">
            <h1 className="text-display-lg text-on-background">
              Architecting the Future of <span className="text-primary-container">African Talent.</span>
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-on-surface-variant">
              Lexep helps African youth learn practical skills, connect with mentors, and find
              internships — for free. Join a community of forward-thinking builders.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/sign-up" size="lg" variant="primary">
                Start Learning Free
              </Button>
              <Button href="/onboarding/choose-role" size="lg" variant="secondary">
                Become a Mentor
              </Button>
            </div>
          </div>
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
        <div className="mx-auto flex max-w-container-max flex-col items-center gap-6 rounded-xl bg-[#1a1a1a] px-md py-xl text-center text-inverse-on-surface">
          <h2 className="text-headline-lg">Ready to build your future?</h2>
          <p className="max-w-xl text-body-md text-[#c9c7c6]">
            Join 10,000+ African youth shaping the future with Lexep.
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
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
