// components/layout/Footer.tsx
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function Footer() {
  return (
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
              <Link href="#explore" className="hover:text-white transition">
                Explore
              </Link>
              <Link href="/mentorship" className="hover:text-white transition">
                Mentors
              </Link>
              <Link href="/opportunities" className="hover:text-white transition">
                Opportunities
              </Link>
              <Link href="/pricing" className="hover:text-white transition">
                Pricing
              </Link>
            </div>
          </div>

          <div>
            <p className="text-label-md font-semibold text-primary-fixed-dim">Company</p>

            <div className="mt-4 flex flex-col gap-3 text-body-md text-[#c9c7c6]">
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
              <Link href="/careers" className="hover:text-white transition">
                Careers
              </Link>
              <Link href="/insights" className="hover:text-white transition">
                Insights
              </Link>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <p className="text-label-md font-semibold text-primary-fixed-dim">Support</p>

            <div className="mt-4 flex flex-col gap-3 text-body-md text-[#c9c7c6]">
              <Link href="/help" className="hover:text-white transition">
                Help Center
              </Link>
              <Link href="/guides" className="hover:text-white transition">
                Guides
              </Link>
              <Link href="/community" className="hover:text-white transition">
                Community
              </Link>
              <Link href="/contact" className="hover:text-white transition">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-xl flex flex-col justify-between gap-4 border-t border-white/10 pt-md text-label-sm text-[#a8a6a5] md:flex-row">
          <span>© {new Date().getFullYear()} Lexep. All rights reserved.</span>

          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>

            <Link href="/contact" className="hover:text-white transition">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}