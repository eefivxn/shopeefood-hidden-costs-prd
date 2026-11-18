import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import type { BudgetStatus } from "../data/types";

export const STATUS_LABEL: Record<BudgetStatus, string> = {
  OK: "Sesuai budget",
  WARN: "Mepet budget",
  EXCEEDED: "Melebihi budget",
};

export const STATUS_CLASS: Record<BudgetStatus, string> = {
  OK: "bg-green-100 text-green-800 border-green-200",
  WARN: "bg-amber-100 text-amber-900 border-amber-200",
  EXCEEDED: "bg-red-100 text-red-800 border-red-200",
};

export const STATUS_DOT: Record<BudgetStatus, string> = {
  OK: "bg-green-500",
  WARN: "bg-amber-500",
  EXCEEDED: "bg-red-500",
};

export function Badge({ status }: { status: BudgetStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_CLASS[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50";
  const styles = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-sm",
    secondary:
      "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 shadow-sm",
    ghost: "text-brand-600 hover:bg-brand-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const el = ref.current;
    el?.querySelector<HTMLElement>(
      "input, button, [tabindex]"
    )?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={ref}
        className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:m-4 sm:max-w-md sm:rounded-2xl"
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        {children}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}

export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "success" | "warning";
}) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
  }[tone];
  return (
    <div
      role="status"
      className={`rounded-xl border p-3 text-sm leading-relaxed ${styles}`}
    >
      {children}
    </div>
  );
}
