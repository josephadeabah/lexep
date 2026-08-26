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
    <div className="bg-background min-h-screen">
      <header className="border-outline-variant/40 border-b">
        <div className="max-w-container-max px-gutter mx-auto flex items-center justify-between py-4">
          <Link href="/">
            <Logo variant="light" />
          </Link>
          <nav className="gap-lg hidden items-center md:flex">
            <Link href="/" className="text-body-md text-on-surface-variant hover:text-primary">
              Explore
            </Link>
            <Link
              href="/mentorship"
              className="text-body-md text-on-surface-variant hover:text-primary"
            >
              Mentors
            </Link>
            <Link
              href="/opportunities"
              className="text-body-md text-on-surface-variant hover:text-primary"
            >
              Projects
            </Link>
            <Link href="/insights" className="text-body-md text-primary underline">
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

      <section className="max-w-container-max gap-md px-gutter py-xl mx-auto grid items-center md:grid-cols-2">
        <div>
          <h1 className="text-display-lg text-on-background" style={{ fontSize: 48 }}>
            Stories of <span className="text-primary-container">Impact</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-4 max-w-md">
            Discover how Lexep is shaping the future of African architecture by connecting ambitious
            learners with world-class mentors. These are the journeys of visionaries redefining the
            built environment.
          </p>
          <Button href="#spotlight" size="lg" className="mt-6">
            Read Featured Story
          </Button>
        </div>
        <div className="bg-surface-container-high overflow-hidden rounded-xl">
          <div className="p-md text-headline-md text-on-surface-variant flex aspect-square items-center justify-center text-center">
            Africa Builds Future: Careers in Architecture &amp; Design
          </div>
        </div>
      </section>

      <section className="bg-inverse-surface py-lg">
        <div className="max-w-container-max gap-md px-gutter mx-auto grid grid-cols-2 text-center md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-display-lg text-primary-fixed-dim" style={{ fontSize: 40 }}>
                {stat.value}
              </p>
              <p className="text-label-sm mt-1 tracking-wide text-[#c9c7c6] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="spotlight" className="max-w-container-max px-gutter py-xl mx-auto">
        <h2 className="text-headline-lg text-on-background text-center">Spotlight Journey</h2>
        <div className="mt-md gap-md border-outline-variant p-md grid rounded-lg border md:grid-cols-2">
          <div className="bg-surface-container-high text-label-sm text-on-surface-variant flex aspect-video items-center justify-center rounded-lg md:aspect-auto">
            Photo: Amara N. on site
          </div>
          <div className="flex flex-col justify-center">
            <span className="bg-primary-fixed text-label-sm text-on-primary-fixed-variant flex w-fit items-center gap-1 rounded-full px-3 py-1">
              <Star className="h-3 w-3" /> Featured Learner
            </span>
            <h3 className="text-headline-md text-on-background mt-3">
              From Studio to Leading Sustainable Urban Projects
            </h3>
            <blockquote className="border-primary-container text-body-md text-on-surface-variant mt-3 border-l-2 pl-4 italic">
              &ldquo;Lexep didn&apos;t just give me knowledge; it gave me the network and confidence
              to pitch my sustainable housing concept to a major firm in Nairobi. The mentorship was
              a game-changer.&rdquo;
            </blockquote>
            <p className="text-label-md text-on-background mt-4">Amara N.</p>
            <p className="text-label-sm text-on-surface-variant">
              Junior Architect at EcoBuild Africa
            </p>
            <Link
              href="/mentorship"
              className="text-label-md text-primary mt-3 flex items-center gap-1 hover:underline"
            >
              Read Full Story <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-outline-variant/40 bg-inverse-surface px-gutter py-md text-inverse-on-surface border-t">
        <div className="max-w-container-max text-label-sm mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <Logo variant="dark" size={22} />
          <span className="text-[#c9c7c6]">
            © {new Date().getFullYear()} Lexep. Shaping African Architecture.
          </span>
          <div className="gap-md flex text-[#c9c7c6]">
            <Link href="#" className="hover:text-primary-fixed-dim">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary-fixed-dim">
              Terms of Service
            </Link>
            <Link href="/help" className="hover:text-primary-fixed-dim">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
