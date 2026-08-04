"use client";

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const safeTotal =
    Math.max(totalPages, 1);

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-between gap-4"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() =>
          onPageChange(page - 1)
        }
        className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Anterior
      </button>

      <span className="text-sm text-slate-400">
        Página {page} de {safeTotal}
      </span>

      <button
        type="button"
        disabled={page >= safeTotal}
        onClick={() =>
          onPageChange(page + 1)
        }
        className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente
      </button>
    </nav>
  );
}
