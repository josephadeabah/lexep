"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Direction = 1 | -1;

type FlipState = {
  direction: Direction;
  page: ReactNode;
} | null;

const DURATION = 950;

export function Flipbook({
  pages,
  labels,
}: {
  pages: ReactNode[];
  labels: string[];
}) {
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<FlipState>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const busy = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const go = useCallback(
    (direction: Direction) => {
      if (busy.current) return;

      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= pages.length) return;

      busy.current = true;

      if (direction === 1) {
        // Forward:
        // Keep the NEXT page underneath while the CURRENT page turns away.
        setFlip({
          direction,
          page: pages[index],
        });
      } else {
        // Backward:
        // Show the PREVIOUS page as the page turning back into view.
        setFlip({
          direction,
          page: pages[nextIndex],
        });
      }

      timeoutRef.current = window.setTimeout(() => {
        setIndex(nextIndex);
        setFlip(null);

        busy.current = false;

        scrollRef.current?.scrollTo({
          top: 0,
          behavior: "instant",
        });
      }, DURATION);
    },
    [index, pages]
  );

  const jump = useCallback(
    (target: number) => {
      if (busy.current) return;
      if (target === index) return;

      // For a distant page, immediately show it after a short
      // directional flip rather than trying to animate through every page.
      if (Math.abs(target - index) > 1) {
        busy.current = true;

        const direction: Direction = target > index ? 1 : -1;

        setFlip({
          direction,
          page:
            direction === 1
              ? pages[index]
              : pages[target],
        });

        timeoutRef.current = window.setTimeout(() => {
          setIndex(target);
          setFlip(null);
          busy.current = false;

          scrollRef.current?.scrollTo({
            top: 0,
            behavior: "instant",
          });
        }, DURATION);

        return;
      }

      go(target > index ? 1 : -1);
    },
    [go, index, pages]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [go]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [index]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const underneathPage =
    flip?.direction === 1
      ? pages[Math.min(index + 1, pages.length - 1)]
      : pages[index];

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-6 md:py-10">
      <div className="book-stage">
        {/* Book shadow and spine */}
        <div
          className="book-shadow pointer-events-none"
          aria-hidden
        />

        <div
          className="book-spine pointer-events-none"
          aria-hidden
        />

        {/* Page underneath the turning page */}
        <div className="book-under-page">
          <div className="page-sheet book-page">
            <div className="book-scroll">
              {underneathPage}
            </div>
          </div>
        </div>

        {/* Main visible page when nothing is flipping */}
        {!flip && (
          <div className="book-current-page">
            <div className="page-sheet book-page">
              <div
                ref={scrollRef}
                className="book-scroll"
              >
                {pages[index]}
              </div>
            </div>
          </div>
        )}

        {/* Physical turning page */}
        {flip && (
          <div
            className={
              flip.direction === 1
                ? "book-turner book-turn-forward"
                : "book-turner book-turn-backward"
            }
            aria-hidden
          >
            {/* Front face */}
            <div className="book-turn-face book-turn-front">
              <div className="page-sheet book-page h-full">
                <div className="book-scroll">
                  {flip.page}
                </div>
              </div>
            </div>

            {/* Back face */}
            <div className="book-turn-face book-turn-back">
              <div className="page-sheet book-page h-full">
                <div className="book-page-back-shadow" />
              </div>
            </div>

            {/* Dynamic shadow while turning */}
            <div className="book-turn-shadow" />
          </div>
        )}
      </div>

      {/* Reader controls */}
      <nav className="mt-6 grid grid-cols-2 items-center gap-3 md:flex md:flex-wrap md:justify-between md:gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0 || busy.current}
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
                className={`h-2.5 w-2.5 rounded-full transition-all disabled:cursor-not-allowed ${
                  i === index
                    ? "scale-110 bg-gold"
                    : "bg-outline-variant hover:scale-110 hover:bg-outline"
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
            disabled={index === pages.length - 1 || busy.current}
            className="w-full rounded-md bg-gold px-4 py-2.5 text-center text-sm font-semibold text-charcoal shadow-page transition-shadow hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-35 md:w-auto md:px-5"
          >
            Next →
          </button>
        </div>
      </nav>
    </div>
  );
}