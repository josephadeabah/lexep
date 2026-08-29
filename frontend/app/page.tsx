'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight, Check, Menu, X } from 'lucide-react'
import { EmailSignup } from '@/components/email-signup'
import { Logo } from '@/components/ui/Logo'

const companies = ['MEST Africa', 'mPharma', 'Hubtel', 'MTN Ghana', 'GIZ Ghana', 'Andela']
const benefits = [
  ['Find your next move', 'Discover roles, internships, and practical opportunities matched to where you are now.'],
  ['Learn from people ahead', 'Build real skills with mentors and practitioners who know the work from the inside.'],
  ['Get the support to grow', 'Access guidance, grants, and a community that keeps your progress moving.'],
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  
  return (
    <main className="min-h-screen bg-white text-[#171714] font-sans">
      {/* HEADER */}
      <header className="mx-auto flex min-h-[76px] w-[calc(100%-64px)] max-w-[1200px] items-center gap-7 border-b border-[#e8e8e2]">
        <Link href="#top" className="inline-flex items-center" aria-label="Lexep home">
          <Logo showWordmark />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="ml-auto hidden gap-7 text-[13px] text-[#686861] md:flex" aria-label="Main navigation">
          <Link href="#how-it-works" className="hover:text-[#171714]">How it works</Link>
          <Link href="#mentorship" className="hover:text-[#171714]">Mentorship</Link>
          <Link href="#opportunities" className="hover:text-[#171714]">Opportunities</Link>
        </nav>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="absolute left-5 right-5 top-[76px] z-50 flex flex-col border-b border-[#e8e8e2] bg-white md:hidden" aria-label="Mobile navigation">
            <Link href="#how-it-works" onClick={() => setMenuOpen(false)} className="border-t border-[#e8e8e2] p-4">How it works</Link>
            <Link href="#mentorship" onClick={() => setMenuOpen(false)} className="border-t border-[#e8e8e2] p-4">Mentorship</Link>
            <Link href="#opportunities" onClick={() => setMenuOpen(false)} className="border-t border-[#e8e8e2] p-4">Opportunities</Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-4 text-[13px] md:ml-0">
          <Link className="font-medium text-[#686861] hover:text-[#171714]" href="/sign-in">Sign in</Link>
          <Link className="inline-flex items-center justify-center gap-2 bg-[#171714] px-4 py-3 font-bold !text-white hover:bg-[#2a2a28]" href="/sign-up">
            Get started <ArrowUpRight size={14} />
          </Link>
          <button 
            className="border-0 bg-transparent md:hidden" 
            aria-label={menuOpen ? 'Close menu' : 'Open menu'} 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid w-[calc(100%-64px)] max-w-[1200px] items-center gap-20 py-[72px] md:min-h-[650px] md:grid-cols-2" id="top">
        <div>
          <p className="mb-5 font-bold text-[#c49a3a] text-[11px] tracking-[0.13em]">
            CAREER SUPPORT FOR AFRICA&apos;S NEXT GENERATION
          </p>
          <h1 className="font-serif text-[clamp(54px,7vw,92px)] leading-[0.95] font-bold tracking-[-0.05em]">
            Build a career<br />
            <em className="not-italic text-[#c49a3a]">that moves.</em>
          </h1>
          <p className="mt-7 max-w-[490px] text-[19px] leading-relaxed text-[#686861]">
            Lexep connects ambitious learners with the mentors, opportunities, and practical support to move from uncertain to unstoppable.
          </p>
          <div className="mt-6 flex items-center gap-6">
            <Link className="inline-flex items-center justify-center gap-2 bg-[#171714] px-4 py-3 font-bold !text-white hover:bg-[#2a2a28]" href="/sign-up">
              Start your journey <ArrowUpRight size={16} />
            </Link>
            <Link className="inline-flex items-center gap-2 font-bold hover:text-[#c49a3a]" href="#how-it-works">
              See how it works <ArrowUpRight size={14} />
            </Link>
          </div>
          <p className="mt-8 flex items-center gap-2 text-[12px] text-[#686861]">
            <Check size={15} /> Built for learners, mentors, and employers across Africa
          </p>
        </div>

        <div className="relative min-h-[440px] overflow-hidden bg-[#f1f0ea]" aria-label="Learner and mentor career connection">
          {/* Visual Card */}
          <div className="absolute left-[34px] top-[40px] z-10 w-[230px] bg-[#171714] p-6 text-white">
            <span className="text-[10px] tracking-[0.12em] text-[#d8bf78]">YOUR NEXT MOVE</span>
            <strong className="mt-4 block font-serif text-[26px] font-medium leading-[1.05]">
              More clarity.<br />More momentum.
            </strong>
            <div className="mt-7 flex items-center gap-2 text-[10px] text-[#b8b8ae]">
              <i className="h-[2px] w-8 bg-[#c49a3a]" />
              <small>Career path in progress</small>
            </div>
          </div>

          {/* Orbit Labels */}
          <div className="pointer-events-none absolute inset-0">
            <span className="absolute right-[9%] top-[20%] rounded-full border border-[#c49a3a]/70 bg-[#f1f0ea]/80 px-3 py-2 text-[10px] font-bold tracking-[0.1em] text-[#c49a3a]">MENTOR</span>
            <span className="absolute left-[11%] bottom-[19%] rounded-full border border-[#c49a3a]/70 bg-[#f1f0ea]/80 px-3 py-2 text-[10px] font-bold tracking-[0.1em] text-[#c49a3a]">LEARN</span>
            <span className="absolute right-[18%] bottom-[11%] rounded-full border border-[#c49a3a]/70 bg-[#f1f0ea]/80 px-3 py-2 text-[10px] font-bold tracking-[0.1em] text-[#c49a3a]">GROW</span>
          </div>

          <Image 
            className="absolute right-0 bottom-0 h-[72%] w-[72%] object-cover mix-blend-multiply" 
            src="/images/mentorship.jpg" 
            alt="Mentor and learner collaborating" 
            width={760} 
            height={620} 
            priority 
          />
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="mx-auto flex w-[calc(100%-64px)] max-w-[1200px] items-center justify-between gap-8 border-y border-[#e8e8e2] py-6 text-[12px] text-[#686861]" aria-label="Organizations in the Lexep network">
        <span>Trusted by people building what&apos;s next</span>
        <div className="flex flex-wrap justify-end gap-6">
          {companies.map((company) => (
            <strong key={company} className="text-[13px] text-[#171714]">{company}</strong>
          ))}
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto w-[calc(100%-64px)] max-w-[760px] py-[150px] pb-[70px]" id="how-it-works">
        <p className="mb-5 font-bold text-[#c49a3a] text-[11px] tracking-[0.13em]">A BETTER WAY FORWARD</p>
        <h2 className="font-serif text-[clamp(54px,7vw,92px)] font-bold leading-[0.95] tracking-[-0.05em]">
          Career support,<br />
          <em className="not-italic text-[#c49a3a]">without the guesswork.</em>
        </h2>
        <p className="mt-7 max-w-[560px] text-[18px] leading-relaxed text-[#686861]">
          Whether you&apos;re looking for your first opportunity or ready for your next one, Lexep brings the right people and pathways into one focused place.
        </p>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto grid w-[calc(100%-64px)] max-w-[1200px] border-y border-[#e8e8e2] md:grid-cols-3" id="mentorship">
        {benefits.map(([title, text], index) => (
          <article key={title} className="p-[30px] pb-[38px] pr-[34px] md:border-l md:border-[#e8e8e2] md:first:border-l-0">
            <span className="text-[12px] font-bold text-[#c49a3a]">0{index + 1}</span>
            <h3 className="mt-12 mb-4 font-serif text-[25px] font-semibold">{title}</h3>
            <p className="mb-6 min-h-[78px] text-[14px] leading-relaxed text-[#686861]">{text}</p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#c49a3a] hover:text-[#a87d2f]">
              Explore <ArrowUpRight size={14} />
            </Link>
          </article>
        ))}
      </section>

      {/* FEATURE */}
      <section className="mx-auto grid w-[calc(100%-64px)] max-w-[1200px] items-center gap-20 py-[150px] md:grid-cols-2" id="opportunities">
        <div className="h-[500px] overflow-hidden bg-[#f1f0ea]">
          <Image src="/images/internship.jpg" alt="Professional team working together" width={900} height={700} className="h-full w-full object-cover mix-blend-multiply" />
        </div>
        <div>
          <p className="mb-5 font-bold text-[#c49a3a] text-[11px] tracking-[0.13em]">YOUR PEOPLE ARE YOUR POWER</p>
          <h2 className="font-serif text-[clamp(54px,7vw,92px)] font-bold leading-[0.95] tracking-[-0.05em]">
            Don&apos;t navigate<br />it <em className="not-italic text-[#c49a3a]">alone.</em>
          </h2>
          <p className="mt-7 max-w-[430px] text-[17px] leading-relaxed text-[#686861]">
            Get matched with mentors who have done the work, join a community that understands the journey, and find opportunities that meet you where you are.
          </p>
          <Link className="mt-8 inline-flex items-center justify-center gap-2 bg-[#171714] px-4 py-3 font-bold !text-white hover:bg-[#2a2a28]" href="/sign-up">
            Join the community <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto flex w-[calc(100%-64px)] max-w-[1200px] items-end justify-between gap-[60px] border-t border-[#e8e8e2] py-[72px]">
        <div>
          <p className="mb-5 font-bold text-[#c49a3a] text-[11px] tracking-[0.13em]">YOUR NEXT CHAPTER STARTS HERE</p>
          <h2 className="font-serif text-[clamp(48px,6vw,76px)] font-bold leading-[0.95] tracking-[-0.05em]">
            Ready to move<br />
            <em className="not-italic text-[#c49a3a]">forward?</em>
          </h2>
        </div>
        <EmailSignup />
      </section>

      {/* FOOTER */}
      <footer className="mx-auto flex w-[calc(100%-64px)] max-w-[1200px] items-center justify-between gap-6 border-t border-[#e8e8e2] py-[30px] text-[12px] text-[#686861]">
        <Link href="#top" className="text-[#171714]"><Logo showWordmark /></Link>
        <div className="flex gap-5">
          <Link href="#how-it-works" className="hover:text-[#171714]">How it works</Link>
          <Link href="#mentorship" className="hover:text-[#171714]">Mentorship</Link>
          <Link href="#opportunities" className="hover:text-[#171714]">Opportunities</Link>
          <Link href="/dashboard" className="hover:text-[#171714]">Dashboard</Link>
        </div>
        <span>© 2026 Lexep, Ghana</span>
      </footer>
    </main>
  )
}