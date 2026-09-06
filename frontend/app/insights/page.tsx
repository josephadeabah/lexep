import Link from "next/link";
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header className="border-b border-outline-variant/40">
        <div className="mx-auto flex max-w-container-max items-center justify-between px-4 py-4 sm:px-gutter">
          <Link href="/"><Logo variant="light" size={26} /></Link>
          <nav className="hidden items-center gap-lg md:flex">
            <Link href="/" className="text-body-md text-on-surface-variant hover:text-primary">Explore</Link>
            <Link href="/mentorship" className="text-body-md text-on-surface-variant hover:text-primary">Mentors</Link>
            <Link href="/opportunities" className="text-body-md text-on-surface-variant hover:text-primary">Projects</Link>
            <Link href="/insights" className="text-body-md text-primary underline">Insights</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button href="/sign-in" variant="secondary" size="sm" className="hidden sm:inline-flex">Sign In</Button>
            <Button href="/sign-up" variant="primary" size="sm" className="sm:size-md">Get Started</Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-container-max items-center gap-lg px-4 py-lg sm:px-gutter sm:py-xl md:grid-cols-2 md:gap-md">
        <div className="text-center md:text-left">
          <h1 className="text-display-md sm:text-display-lg text-on-background" style={{ fontSize: 36, lineHeight: 1.2 }}>
            Stories of <span className="text-primary-container">Impact</span>
          </h1>
          <p className="mt-4 max-w-md text-body-md sm:text-body-lg text-on-surface-variant mx-auto md:mx-0">
            Discover how Lexep is shaping the future of African architecture by connecting ambitious learners
            with world-class mentors. These are the journeys of visionaries redefining the built environment.
          </p>
          <Button href="#spotlight" size="lg" className="mt-6 w-full sm:w-auto">
            Read Featured Story
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl bg-surface-container-high">
          <div className="flex aspect-square items-center justify-center p-4 sm:p-md text-center text-headline-sm sm:text-headline-md text-on-surface-variant">
            Africa Builds Future: Careers in Architecture &amp; Design
          </div>
        </div>
      </section>

      <section className="bg-inverse-surface py-md sm:py-lg">
        <div className="mx-auto grid max-w-container-max grid-cols-2 gap-4 px-4 sm:gap-md sm:px-gutter text-center md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-display-md sm:text-display-lg text-primary-fixed-dim" style={{ fontSize: 32, lineHeight: 1.2 }}>
                {stat.value}
              </p>
              <p className="mt-1 text-label-sm uppercase tracking-wide text-[#c9c7c6]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="spotlight" className="mx-auto max-w-container-max px-4 py-lg sm:px-gutter sm:py-xl">
        <h2 className="text-center text-headline-md sm:text-headline-lg text-on-background">Spotlight Journey</h2>
        <div className="mt-md grid gap-4 rounded-lg border border-outline-variant p-4 sm:gap-md sm:p-md md:grid-cols-2">
          <div className="flex aspect-video items-center justify-center rounded-lg bg-surface-container-high text-label-sm text-on-surface-variant md:aspect-auto">
            Photo: Amara N. on site
          </div>
          <div className="flex flex-col justify-center">
            <span className="flex w-fit items-center gap-1 rounded-full bg-primary-fixed px-3 py-1 text-label-sm text-on-primary-fixed-variant">
              <Star className="h-3 w-3" /> Featured Learner
            </span>
            <h3 className="mt-3 text-headline-sm sm:text-headline-md text-on-background">From Studio to Leading Sustainable Urban Projects</h3>
            <blockquote className="mt-3 border-l-2 border-primary-container pl-4 text-body-sm sm:text-body-md italic text-on-surface-variant">
              &ldquo;Lexep didn&apos;t just give me knowledge; it gave me the network and confidence to pitch my
              sustainable housing concept to a major firm in Nairobi. The mentorship was a game-changer.&rdquo;
            </blockquote>
            <p className="mt-4 text-label-md text-on-background">Amara N.</p>
            <p className="text-label-sm text-on-surface-variant">Junior Architect at EcoBuild Africa</p>
            <Link href="/mentorship" className="mt-3 flex items-center gap-1 text-label-md text-primary hover:underline">
              Read Full Story <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-outline-variant/40 bg-inverse-surface px-4 py-md sm:px-gutter text-inverse-on-surface">
        <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-4 text-label-sm md:flex-row">
          <Logo variant="dark" size={22} />
          <span className="text-[#c9c7c6] text-center">© {new Date().getFullYear()} Lexep. Shaping African Architecture.</span>
          <div className="flex gap-md text-[#c9c7c6]">
            <Link href="#" className="hover:text-primary-fixed-dim">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary-fixed-dim">Terms of Service</Link>
            <Link href="/help" className="hover:text-primary-fixed-dim">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}