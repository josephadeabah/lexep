"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Leaf = { node: ReactNode; dir: 1 | -1 } | null;

const DURATION = 780;

export function Flipbook({ pages, labels }: { pages: ReactNode[]; labels: string[] }) {
  const [index, setIndex] = useState(0);
  const [leaf, setLeaf] = useState<Leaf>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const busy = useRef(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (busy.current) return;
      const next = index + dir;
      if (next < 0 || next >= pages.length) return;
      busy.current = true;

      if (dir === 1) {
        setLeaf({ node: pages[index], dir });
        setIndex(next);
      } else {
        setLeaf({ node: pages[next], dir });
      }

      window.setTimeout(() => {
        if (dir === -1) setIndex(next);
        setLeaf(null);
        busy.current = false;
        scrollRef.current?.scrollTo({ top: 0 });
      }, DURATION);
    },
    [index, pages]
  );

  const jump = useCallback(
    (target: number) => {
      if (busy.current || target === index) return;
      go(target > index ? 1 : -1);
      // multi-step jumps settle after the single flip
      if (Math.abs(target - index) > 1) {
        window.setTimeout(() => setIndex(target), DURATION);
      }
    },
    [go, index]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-6 md:py-10">
      <div className="book-stage relative">
        <div className="book-spine pointer-events-none" aria-hidden />

        <div className="page-sheet book-page relative overflow-hidden">
          <div ref={scrollRef} className="book-scroll">
            {pages[index]}
          </div>
        </div>

        {leaf && (
          <div className="book-leaf-wrap pointer-events-none" aria-hidden>
            <div className={leaf.dir === 1 ? "book-leaf leaf-out" : "book-leaf leaf-in"}>
              <div className="page-sheet book-page h-full overflow-hidden">
                <div className="book-scroll">{leaf.node}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reader controls */}
      <nav className="mt-6 grid grid-cols-2 items-center gap-3 md:flex md:flex-wrap md:justify-between md:gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="bg-surface-lowest hover:shadow-page order-2 w-full rounded-md border border-outline-variant px-4 py-2.5 text-center text-sm font-semibold text-on-surface transition-shadow disabled:opacity-35 md:order-none md:w-auto md:px-5"
        >
          ← Previous
        </button>

        <ol className="order-1 col-span-2 flex w-full flex-wrap items-center justify-center gap-2 md:order-none md:col-span-1 md:w-auto">
          {labels.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => jump(i)}
                aria-current={i === index}
                title={label}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === index ? "bg-gold" : "bg-outline-variant hover:bg-outline"
                }`}
              >
                <span className="sr-only">{label}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="order-3 flex w-full items-center justify-end gap-3 md:order-none md:w-auto md:gap-4">
          <span className="folio hidden md:inline">
            {index + 1} / {pages.length}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === pages.length - 1}
            className="bg-gold text-charcoal shadow-page hover:shadow-lift w-full rounded-md px-4 py-2.5 text-center text-sm font-semibold transition-shadow disabled:opacity-35 md:w-auto md:px-5"
          >
            Next →
          </button>
        </div>
      </nav>
    </div>
  );
}
