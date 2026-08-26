import Link from "next/link";

import { Logo } from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="text-inverse-on-surface border-t border-white/10 bg-[#101010]">
      <div className="max-w-container-max px-gutter py-xl mx-auto">
        <div className="gap-xl grid md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Logo variant="dark" size={64} />

            <p className="text-body-md mt-5 max-w-xs leading-relaxed text-[#a8a6a5]">
              Helping African youth learn, connect, gain real-world experience, access opportunities
              and community support, and build toward the future they imagine.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-label-md text-primary-fixed-dim font-semibold">Platform</p>

            <div className="text-body-md mt-4 flex flex-col gap-3 text-[#c9c7c6]">
              <Link href="/explore" className="transition hover:text-white">
                Learning
              </Link>

              <Link href="/mentorship" className="transition hover:text-white">
                Mentorship
              </Link>

              <Link href="/opportunities" className="transition hover:text-white">
                Internships & Opportunities
              </Link>

              <Link href="/grants" className="transition hover:text-white">
                Grants & Support
              </Link>
            </div>
          </div>

          {/* Organisation */}
          <div>
            <p className="text-label-md text-primary-fixed-dim font-semibold">Lexep</p>

            <div className="text-body-md mt-4 flex flex-col gap-3 text-[#c9c7c6]">
              <Link href="/about" className="transition hover:text-white">
                About Us
              </Link>

              <Link href="/careers" className="transition hover:text-white">
                Careers
              </Link>

              <Link href="/insights" className="transition hover:text-white">
                Insights
              </Link>

              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <p className="text-label-md text-primary-fixed-dim font-semibold">Support</p>

            <div className="text-body-md mt-4 flex flex-col gap-3 text-[#c9c7c6]">
              <Link href="/help" className="transition hover:text-white">
                Help Center
              </Link>

              <Link href="/guides" className="transition hover:text-white">
                Guides
              </Link>

              <Link href="/community" className="transition hover:text-white">
                Community
              </Link>

              <Link href="/contact" className="transition hover:text-white">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-xl pt-md text-label-sm flex flex-col justify-between gap-4 border-t border-white/10 text-[#a8a6a5] md:flex-row">
          <span>© {new Date().getFullYear()} Lexep. All rights reserved.</span>

          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>

            <Link href="/terms" className="transition hover:text-white">
              Terms of Service
            </Link>

            <Link href="/contact" className="transition hover:text-white">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
