"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Direction = 1 | -1;

type Leaf = {
  node: ReactNode;
  direction: Direction;
} | null;

const DURATION = 780;

export function Flipbook({
  pages,
  labels,
}: {
  pages: ReactNode[];
  labels: string[];
}) {
  const [index, setIndex] = useState(0);
  const [leaf, setLeaf] = useState<Leaf>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const busy = useRef(false);

  const go = useCallback(
    (direction: Direction) => {
      if (busy.current) return;

      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= pages.length) return;

      busy.current = true;

      if (direction === 1) {
        // Keep the current page visible and turn it away.
        // The next page sits underneath.
        setLeaf({
          node: pages[index],
          direction,
        });

        setIndex(nextIndex);
      } else {
        // Put the previous page on top and animate it back.
        setLeaf({
          node: pages[nextIndex],
          direction,
        });
      }

      window.setTimeout(() => {
        if (direction === -1) {
          setIndex(nextIndex);
        }

        setLeaf(null);
        busy.current = false;

        scrollRef.current?.scrollTo({
          top: 0,
          behavior: "auto",
        });
      }, DURATION);
    },
    [index, pages]
  );

  const jump = useCallback(
    (target: number) => {
      if (busy.current || target === index) return;

      go(target > index ? 1 : -1);

      // For distant page jumps, finish on the selected page
      // after the directional flip animation.
      if (Math.abs(target - index) > 1) {
        window.setTimeout(() => {
          setIndex(target);
        }, DURATION);
      }
    },
    [go, index]
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [go]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [index]);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-6 md:py-10">
      {/* Book */}
      <div className="book-stage relative">
        <div
          className="book-spine pointer-events-none"
          aria-hidden="true"
        />

        {/* Current / next page */}
        <div className="page-sheet book-page relative overflow-hidden">
          <div ref={scrollRef} className="book-scroll">
            {pages[index]}
          </div>
        </div>

        {/* Turning page */}
        {leaf && (
          <div
            className="book-leaf-wrap pointer-events-none"
            aria-hidden="true"
          >
            <div
              className={
                leaf.direction === 1
                  ? "book-leaf leaf-out"
                  : "book-leaf leaf-in"
              }
            >
              {/* Front of the paper */}
              <div className="book-leaf-face book-leaf-front">
                <div className="page-sheet book-page h-full overflow-hidden">
                  <div className="book-scroll">{leaf.node}</div>
                </div>
              </div>

              {/* Back of the paper — gives the sheet thickness/shading */}
              <div className="book-leaf-face book-leaf-back">
                <div className="page-sheet book-page h-full overflow-hidden">
                  <div className="book-leaf-back-shadow" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls — deliberately OUTSIDE book-stage */}
      <nav className="relative z-20 mt-6 grid grid-cols-2 items-center gap-3 md:flex md:flex-wrap md:justify-between md:gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="order-2 w-full rounded-md border border-outline-variant bg-surface-lowest px-4 py-2.5 text-center text-sm font-semibold text-on-surface transition-shadow hover:shadow-page disabled:cursor-not-allowed disabled:opacity-35 md:order-none md:w-auto md:px-5"
        >
          ← Previous
        </button>

        <ol className="order-1 col-span-2 flex w-full flex-wrap items-center justify-center gap-2 md:order-none md:col-span-1 md:w-auto">
          {labels.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => jump(i)}
                disabled={busy.current}
                aria-current={i === index}
                title={label}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === index
                    ? "bg-gold"
                    : "bg-outline-variant hover:bg-outline"
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
            className="w-full rounded-md bg-gold px-4 py-2.5 text-center text-sm font-semibold text-charcoal shadow-page transition-shadow hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-35 md:w-auto md:px-5"
          >
            Next →
          </button>
        </div>
      </nav>
    </div>
  );
}