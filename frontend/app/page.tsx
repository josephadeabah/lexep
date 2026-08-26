'use client'

import { useState } from 'react'
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, CircleCheck, HandCoins, Menu, Sparkles, Users, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

const pages = [
  { number: '01', eyebrow: 'The opportunity', title: 'The future of work is waiting.', copy: 'Ghana has one of Africa’s youngest populations. Lexep turns that energy into a fairer path from ambition to meaningful work.', note: '57% of Ghana’s population is under 25.' },
  { number: '02', eyebrow: 'Chapter one', title: 'Experience that opens doors.', copy: 'Paid internships connect motivated learners with vetted companies, creating practical confidence and a pipeline of future hires.', note: 'For learners + employers' },
  { number: '03', eyebrow: 'Chapter two', title: 'Guidance from someone ahead.', copy: 'One-on-one mentorship makes the unwritten rules of work visible — from portfolio reviews to technical coaching and career navigation.', note: 'Software · Finance · Design · More' },
  { number: '04', eyebrow: 'Chapter three', title: 'Resources, shared directly.', copy: 'Grant groups help communities pool support for laptops, certifications, internet access and more. Organizers receive and distribute funds directly.', note: 'Lexep never holds the money.' },
]

const pathways = [
  { icon: Sparkles, label: 'Internships', title: 'Build proof, not just promises.', copy: 'Find paid opportunities with companies that are ready to invest in local talent.' },
  { icon: Users, label: 'Mentorship', title: 'Borrow a little perspective.', copy: 'Get practical guidance from experienced professionals who have walked the path.' },
  { icon: HandCoins, label: 'Grant groups', title: 'Let your community move you forward.', copy: 'Discover organizer-led funding for the tools and skills your next chapter needs.' },
]

export default function Page() {
  const [page, setPage] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const current = pages[page]

  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <main className="lexep-site">
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="Lexep home"><Logo size={64} /></a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a href="#why" onClick={() => setMenuOpen(false)}>Why Lexep</a>
          <a href="#pathways" onClick={() => setMenuOpen(false)}>Pathways</a>
          <a href="#grants" onClick={() => setMenuOpen(false)}>For organizers</a>
          <a href="#join" onClick={() => setMenuOpen(false)}>Join the movement</a>
        </nav>
        <a className="header-cta" href="#join">Get started <ArrowRight size={16} /></a>
        <button className="menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="overline">A new chapter for Ghanaian talent</p>
          <h1>Bridge the gap.<br /><em>Build the future.</em></h1>
          <p className="hero-lede">Lexep is where ambition meets opportunity — internships, mentors, and community support for the journey ahead.</p>
          <div className="hero-actions"><a className="button button-primary" href="#pathways">Explore Lexep <ArrowRight size={17} /></a><a className="text-link" href="#why">Why this matters <span>↘</span></a></div>
          <div className="hero-proof"><span className="proof-line" /> <span>Built for the next generation of Ghanaian professionals.</span></div>
        </div>
        <div className="book-stage" aria-label="Interactive Lexep book">
          <div className="book-shadow" />
          <div className="book">
            <div className="book-page book-left"><span className="page-number">LEXEP / {current.number}</span><div className="page-art"><BookOpen size={28} strokeWidth={1.2} /><span>the<br />open<br /><i>book</i></span></div><span className="page-footer">Accra · Ghana</span></div>
            <div className="book-gutter" />
            <div className="book-page book-right" key={page}><span className="page-eyebrow">{current.eyebrow}</span><h2>{current.title}</h2><p>{current.copy}</p><div className="page-rule" /><span className="page-note">{current.note}</span><span className="page-number right-number">0{page + 1}</span></div>
          </div>
          <div className="book-controls"><button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} aria-label="Previous page"><ChevronLeft /></button><div className="page-dots">{pages.map((item, index) => <button key={item.number} aria-label={`Go to page ${index + 1}`} className={index === page ? 'active' : ''} onClick={() => setPage(index)} />)}</div><button onClick={() => setPage(Math.min(pages.length - 1, page + 1))} disabled={page === pages.length - 1} aria-label="Next page"><ChevronRight /></button></div>
        </div>
      </section>

      <section className="statement-section" id="why"><div className="section-kicker">The case for a new chapter</div><div className="statement-grid"><h2>Talent is everywhere.<br /><span>Access is not.</span></h2><div><p className="large-copy">Every year, more than 300,000 graduates enter Ghana’s job market. Too many leave it without the experience, guidance, or resources to get started.</p><p>Lexep is the bridge between what young people can become and the opportunities that help them get there.</p></div></div></section>

      <section className="pathways-section" id="pathways"><div className="section-heading"><div><div className="section-kicker">Three ways forward</div><h2>Your next chapter<br />starts here.</h2></div><p>Choose the path that fits your ambition. Or choose all three.</p></div><div className="pathway-grid">{pathways.map(({ icon: Icon, label, title, copy }) => <article className="pathway" key={label}><div className="pathway-icon"><Icon size={21} /></div><p className="pathway-label">{label}</p><h3>{title}</h3><p>{copy}</p><a href="#join" aria-label={`Explore ${label}`}>Explore <ArrowRight size={15} /></a></article>)}</div></section>

      <section className="grant-section" id="grants"><div className="grant-card"><div className="grant-tag">A note on grants</div><h2>Lexep is the trust layer,<br /><em>not the money layer.</em></h2><p>Organizers create grant groups, receive contributions directly through MoMo or bank transfer, and distribute funds to beneficiaries. Lexep keeps the story visible: progress, updates, impact.</p><div className="grant-points"><span><CircleCheck size={17} /> Direct organizer distribution</span><span><CircleCheck size={17} /> Public contribution logs</span><span><CircleCheck size={17} /> Impact updates for supporters</span></div><a className="button button-dark" href="#join">Start a grant group <ArrowRight size={17} /></a></div><div className="grant-aside"><span className="aside-mark">“</span><p>When communities organize around potential, a little support can travel a long way.</p><span className="aside-caption">— The Lexep principle</span></div></section>

      <section className="join-section" id="join"><div className="join-copy"><div className="section-kicker">The next page is yours</div><h2>Ready to write<br /><em>what’s next?</em></h2><p>Join the early community of learners, mentors, employers, and organizers building Ghana’s future of work.</p></div><form className="signup-form" onSubmit={subscribe}><label htmlFor="email">Get the first edition</label><div className="input-row"><input id="email" type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required /><button className="button button-primary" type="submit">{submitted ? 'You’re on the list' : 'Join Lexep'} <ArrowRight size={16} /></button></div><small>{submitted ? 'We’ll be in touch when the doors open.' : 'No noise. Just meaningful updates.'}</small></form></section>
      <footer className="site-footer"><a href="#top" className="wordmark"><Logo size={64} /></a><span>Bridge the gap. Build the future.</span><span>© 2026 Lexep, Ghana</span></footer>
    </main>
  )
}
