import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Simple prev/next + page-number pagination. Used anywhere a list is
 * backed by a paginated API response (see lib/types.ts Page<T>). */
export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-md border border-outline-variant p-2 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-label-sm text-on-surface-variant">…</span>}
          <button
            onClick={() => onPageChange(p)}
            className={cn(
              "h-9 min-w-9 rounded-md px-2 text-label-md",
              p === page ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-md border border-outline-variant p-2 disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
