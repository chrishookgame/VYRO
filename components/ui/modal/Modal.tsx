"use client";

import {
  useEffect,
} from "react";

import type {
  ReactNode,
} from "react";

export type ModalProps = {
  open: boolean;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export default function Modal({
  open,
  title,
  children,
  footer,
  onClose,
}: ModalProps) {
  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      window.addEventListener(
        "keydown",
        handleKeyDown,
      );
    }

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Modal"}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="flex items-center justify-between border-b border-slate-800 p-5">
          <h2 className="text-xl font-bold">
            {title ?? "Información"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        <div className="p-6">
          {children}
        </div>

        {footer && (
          <footer className="border-t border-slate-800 p-5">
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}
