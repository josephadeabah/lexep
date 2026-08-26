
// REMOVE this line: 
// import { createFileRoute } from "@tanstack/react-router";

import { Flipbook } from "@/components/layout/Flipbook";

// REMOVE this entire block:
// export const Route = createFileRoute()({
//   head: () => ({
//     meta: [
//       { title: "Lexep — Bridge the Gap. Build the Future." },
//       {
//         name: "description",
//         content:
//           "A field book on Ghana's youth opportunity: paid internships, professional mentorship, and community-funded grants — connected on one platform.",
//       },
//       { property: "og:title", content: "Lexep — Bridge the Gap. Build the Future." },
//       {
//         property: "og:description",
//         content:
//           "A field book on Ghana's youth opportunity: paid internships, professional mentorship, and community-funded grants.",
//       },
//       { property: "og:type", content: "website" },
//       { name: "twitter:card", content: "summary_large_image" },
//     ],
//   }),
//   component: Index,
// });

// ADD this for SEO metadata (Next.js format):
export const metadata = {
  title: "Lexep — Bridge the Gap. Build the Future.",
  description: "A field book on Ghana's youth opportunity: paid internships, professional mentorship, and community-funded grants — connected on one platform.",
  openGraph: {
    title: "Lexep — Bridge the Gap. Build the Future.",
    description: "A field book on Ghana's youth opportunity: paid internships, professional mentorship, and community-funded grants.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lexep — Bridge the Gap. Build the Future.",
    description: "A field book on Ghana's youth opportunity: paid internships, professional mentorship, and community-funded grants.",
  },
};

const plates = [
  {
    src: "/images/hero-portrait.jpg",
    title: "Plate I — The Graduate",
    caption: "Accra, 2026. One in three young people in Greater Accra is out of work.",
    w: 1200,
    h: 1600,
  },
  {
    src: "/images/internship.jpg",
    title: "Plate II — The Internship",
    caption: "A paid placement is the shortest proven path from classroom to payroll.",
    w: 1600,
    h: 1008,
  },
  {
    src: "/images/mentorship.jpg",
    title: "Plate III — The Mentor",
    caption: "Guidance from someone who has already walked the path.",
    w: 1600,
    h: 1008,
  },
  {
    src: "/images/grants.jpg",
    title: "Plate IV — The Grant Group",
    caption: "Organisers raise, organisers disburse. The platform keeps the record.",
    w: 1600,
    h: 1008,
  },
  {
    src: "/images/cover-texture.jpg",
    title: "Plate V — The Binding",
    caption: "Deep gold on cloth: the wealth of knowledge.",
    w: 1600,
    h: 1008,
  },
];

const figures = [
  { value: "2M", label: "Youth aged 15–35 not in education, employment or training" },
  { value: "21.9%", label: "National youth unemployment rate" },
  { value: "31.9%", label: "Youth unemployment in Greater Accra" },
  { value: "60%+", label: "Graduates without work in their first year" },
];

const tiers = [
  { name: "Learner", price: "GHS 0", body: "Internships, mentor discovery, grant applications." },
  {
    name: "Learner Plus",
    price: "GHS 99/mo",
    body: "Premium mentorship packages, advanced matching, career assessments.",
  },
  {
    name: "Company",
    price: "GHS 499/mo",
    body: "Unlimited internship posts, applicant review, matching analytics.",
  },
  {
    name: "Enterprise",
    price: "Custom",
    body: "Multi-department access, employer branding, dedicated support.",
  },
];

const advantages = [
  ["Offline-first", "Unreliable internet won't stop you — apply, contribute and learn offline."],
  ["Mobile-optimised", "Built for the device most Ghanaians actually use."],
  ["Idempotent operations", "No duplicate applications or double charges on flaky networks."],
  ["Local currency", "Transactions in GHS, not just USD."],
  ["Real matching", "The right opportunities, not merely any opportunity."],
];

const bridges = [
  {
    n: "01",
    img: "/images/internship.jpg",
    alt: "Young Ghanaian intern working at a desk in a modern office",
    title: "Paid internships that work",
    body: "Companies post opportunities, learners apply, and matching suggests the strongest candidates on skills and fit. Structured placements build the hiring pipeline employers say they lack.",
    bullets: [
      "Pre-vetted, motivated candidates",
      "Applicant review and matching analytics",
      "A pipeline of future hires, not one-off CVs",
    ],
  },
  {
    n: "02",
    img: "/images/mentorship.jpg",
    alt: "A mentor guiding a young professional through work on a laptop",
    title: "Mentorship that transforms",
    body: "Approved mentors across software, data, architecture, finance and more offer structured packages — portfolio reviews, career coaching, technical guidance.",
    bullets: [
      "Structured, priced mentorship packages",
      "Match percentages on skills and goals",
      "Direct access to working practitioners",
    ],
  },
  {
    n: "03",
    img: "/images/grants.jpg",
    alt: "A community group of young Ghanaians collaborating around a table",
    title: "Community-funded grants",
    body: "Groups pool resources for laptops, connectivity and certifications. Organisers run the money; Lexep runs the record.",
    bullets: [
      "Goal, timeline and public contribution log",
      "Impact updates from beneficiaries",
      "Verified-organiser badges and ratings",
    ],
  },
];

function Overline({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function Page({
  running,
  folio,
  children,
}: {
  running: string;
  folio: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[inherit] flex-col px-6 py-10 md:px-16 md:py-14">
      <header className="mb-10 flex items-baseline justify-between border-b border-outline-variant/60 pb-4">
        <span className="folio">{running}</span>
        <span className="folio">Lexep · Edition I</span>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="mt-12 flex items-center justify-between border-t border-outline-variant/60 pt-4">
        <span className="folio">Bridge the Gap</span>
        <span className="folio">{folio}</span>
      </footer>
    </div>
  );
}

function Cover() {
  return (
    <div className="grid md:grid-cols-2">
      <div className="relative flex flex-col justify-between p-8 md:p-16">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold tracking-[0.3em] text-on-surface">
            LEXEP
          </span>
          <span className="folio">Edition I · Ghana</span>
        </div>

        <div className="py-14 md:py-20">
          <Overline>A field book on the future of work</Overline>
          <h1 className="mt-6 font-display text-[2.75rem] font-bold leading-[1.05] tracking-[-0.02em] text-on-surface md:text-6xl">
            Bridge the Gap.
            <br />
            <span className="text-primary">Build the Future.</span>
          </h1>
          <div className="rule-gold mt-8" />
          <p className="mt-8 max-w-md text-lg leading-8 text-on-surface-variant">
            Ghana has ambition in abundance and access in shortage. Lexep connects young Ghanaians
            to paid internships, professional mentors, and community-funded grants — in one place.
          </p>
          <a
            href="/sign-up"
            className="bg-gold text-charcoal shadow-page hover:shadow-lift mt-8 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-shadow"
          >
            Get started
          </a>
          <p className="mt-6 text-sm text-outline">
            Turn the page below, or use your ← → arrow keys.
          </p>
        </div>

        <p className="folio">Sources: Ghana Statistical Service · Parliament of Ghana</p>
      </div>

      <div className="relative min-h-[420px] bg-surface-container">
        <img
          src="/images/hero-portrait.jpg"
          alt="Young Ghanaian professional standing in a modern Accra office atrium"
          width={1200}
          height={1600}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

function Contents() {
  return (
    <Page running="Contents" folio="Page 5">
      <Overline>Contents</Overline>
      <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border border-outline-variant bg-outline-variant md:grid-cols-2">
        {[
          ["I", "The Problem in Ghanaian Context"],
          ["II", "Three Bridges: Internships, Mentors, Grants"],
          ["III", "Grant Groups Without Custody"],
          ["IV", "The Plates"],
        ].map(([num, title]) => (
          <li key={num} className="bg-surface-lowest">
            <div className="flex items-baseline gap-6 px-6 py-6 md:px-10">
              <span className="font-display text-sm font-semibold tracking-[0.2em] text-primary">
                {num}
              </span>
              <span className="font-display text-xl font-semibold text-on-surface">{title}</span>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-10 max-w-xl text-lg leading-8 text-on-surface-variant">
        This edition reads like a book: each page turns. Nothing here is a brochure — it is the case
        for a single platform that connects work, guidance and money for Ghana&apos;s young people.
      </p>
    </Page>
  );
}

function ChapterOne() {
  return (
    <Page running="Chapter One · The Problem" folio="Page 12">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Overline>Chapter one</Overline>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-10 text-on-surface md:text-4xl">
            A generation ready for work, waiting at the door
          </h2>
          <div className="rule-gold mt-6" />
        </div>
        <div className="md:col-span-7">
          <p className="drop-cap text-lg leading-8 text-on-surface-variant">
            Ghana adds more than 300,000 graduates to the labour market every year, and only about
            four in ten find employment within twelve months. Seven in ten unemployed Ghanaians are
            under 35. At the same time, employers report the opposite shortage: candidates with
            theory but no workplace exposure.
          </p>
          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            The binding constraint is not ambition. It is access — to a first placement, to a
            practitioner who will answer questions, and to the small amounts of money that turn
            potential into a portfolio.
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-outline-variant bg-outline-variant sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((f) => (
          <div key={f.value} className="bg-surface-low p-8">
            <p className="font-display text-4xl font-bold text-primary">{f.value}</p>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">{f.label}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

function BridgePage({ item, i }: { item: (typeof bridges)[number]; i: number }) {
  return (
    <Page running={`Chapter Two · Bridge ${item.n}`} folio={`Page ${28 + i * 2}`}>
      <Overline>Chapter two · Three bridges</Overline>
      <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-10 text-on-surface md:text-4xl">
        {item.title}
      </h2>
      <div className="rule-gold mt-6" />

      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <figure className="overflow-hidden rounded-lg border border-outline-variant">
          <img
            src={item.img}
            alt={item.alt}
            loading="lazy"
            width={1600}
            height={1008}
            className="aspect-video w-full object-cover"
          />
        </figure>
        <div>
          <span className="folio">{item.n}</span>
          <p className="mt-4 text-base leading-7 text-on-surface-variant">{item.body}</p>
          <ul className="mt-6 space-y-3">
            {item.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-base text-on-surface-variant">
                <span className="bg-gold mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {i === 2 && (
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-outline-variant bg-outline-variant md:grid-cols-5">
          {advantages.map(([title, body]) => (
            <div key={title} className="bg-surface-lowest p-6">
              <p className="font-display text-sm font-semibold text-on-surface">{title}</p>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{body}</p>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}

function ChapterThree() {
  return (
    <Page running="Chapter Three · Grant Groups" folio="Page 44">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Overline>Chapter three</Overline>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-10 text-on-surface md:text-4xl">
            Lexep is the trust layer, never the custodian
          </h2>
          <div className="rule-gold mt-6" />
          <p className="mt-6 text-lg leading-8 text-on-surface-variant">
            Organisers receive contributions directly — mobile money, bank transfer, cash — and
            disburse them themselves. Lexep records the promise and publishes the proof.
          </p>
        </div>
        <div className="md:col-span-7">
          <ol className="relative space-y-8 border-l border-outline-variant pl-8">
            {[
              "An organiser creates a grant group with a goal, category and timeline.",
              "Contributors send funds directly to the organiser.",
              "The organiser logs each contribution; the public ledger updates.",
              "The organiser distributes laptops, fees or stipends to beneficiaries.",
              "Impact updates and photos are published; contributors are credited by name.",
            ].map((step, i) => (
              <li key={step} className="relative">
                <span className="bg-gold text-charcoal absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full font-display text-[10px] font-bold">
                  {i + 1}
                </span>
                <p className="text-base leading-7 text-on-surface-variant">{step}</p>
              </li>
            ))}
          </ol>
          <p className="bg-surface-low mt-10 rounded-lg p-8 font-display text-xl font-semibold leading-8 text-on-surface">
            “Lexep never touched a single cedi.”
            <span className="mt-3 block text-sm font-medium tracking-wide text-outline">
              A discovery and transparency platform — not a financial institution.
            </span>
          </p>
        </div>
      </div>

      <div className="mt-14">
        <Overline>Access</Overline>
        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-outline-variant bg-outline-variant md:grid-cols-4">
          {tiers.map((t) => (
            <div key={t.name} className="bg-surface-lowest flex flex-col p-8">
              <p className="font-display text-lg font-semibold text-on-surface">{t.name}</p>
              <p className="mt-2 font-display text-2xl font-bold text-primary">{t.price}</p>
              <p className="mt-4 text-sm leading-6 text-on-surface-variant">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

function Plates() {
  return (
    <Page running="Chapter Four · Plates" folio="Page 58">
      <Overline>Chapter four · Plates</Overline>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-10 text-on-surface md:text-4xl">
        The image plates of this edition
      </h2>
      <div className="rule-gold mt-6" />

      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plates.map((p) => (
          <figure
            key={p.title}
            className="bg-surface-lowest shadow-page flex flex-col overflow-hidden rounded-lg border border-outline-variant"
          >
            <img
              src={p.src}
              alt={p.caption}
              loading="lazy"
              width={p.w}
              height={p.h}
              className="aspect-video w-full object-cover"
            />
            <figcaption className="flex flex-1 flex-col p-8">
              <p className="folio">{p.title}</p>
              <p className="mt-3 flex-1 text-sm leading-6 text-on-surface-variant">{p.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Page>
  );
}

function Colophon() {
  return (
    <div className="bg-charcoal flex min-h-[inherit] flex-col px-6 py-16 md:px-16 md:py-20">
      <div className="grid flex-1 gap-12 md:grid-cols-3">
        {[
          ["For young Ghanaians", "Stop waiting for a job. Start building a career."],
          ["For employers", "Your next great hire is waiting. We'll help you find them."],
          ["For institutions", "Invest in Ghana's most valuable resource: its youth."],
        ].map(([label, line]) => (
          <div key={label}>
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-inverse-primary">
              {label}
            </p>
            <p className="mt-4 font-display text-2xl font-semibold leading-9 text-inverse-on-surface">
              {line}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-inverse-on-surface/10 pt-10">
        <p className="font-display text-xl font-semibold text-inverse-on-surface">
          Lexep — Bridge the Gap. Build the Future.
        </p>
        <a
          href="https://lexep.org"
          className="bg-gold text-charcoal shadow-lift rounded-md px-6 py-3 text-sm font-semibold"
        >
          Sign up at lexep.org
        </a>
      </div>
      <p className="mt-8 text-xs leading-6 text-inverse-on-surface/60">
        Colophon: set in Hanken Grotesk and Inter. Sources: Ghana Statistical Service (2025/2026);
        Parliament of Ghana (2026); GBC Ghana Online; GhanaWeb; Westerwelle Foundation.
      </p>
    </div>
  );
}

// CHANGE this line - add "export default" before "function Index()"
export default function Index() {
  const pages = [
    <Cover key="cover" />,
    <Contents key="contents" />,
    <ChapterOne key="one" />,
    ...bridges.map((item, i) => <BridgePage key={item.n} item={item} i={i} />),
    <ChapterThree key="three" />,
    <Plates key="plates" />,
    <Colophon key="colophon" />,
  ];

  const labels = [
    "Cover",
    "Contents",
    "Chapter One",
    "Bridge 01",
    "Bridge 02",
    "Bridge 03",
    "Chapter Three",
    "Plates",
    "Colophon",
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-surface">
      <Flipbook pages={pages} labels={labels} />
    </main>
  );
}