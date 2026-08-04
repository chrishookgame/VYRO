import {
  forwardRef,
} from "react";

import type {
  SelectHTMLAttributes,
} from "react";

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = forwardRef<
  HTMLSelectElement,
  SelectProps
>(function Select(
  {
    label,
    error,
    className = "",
    id,
    children,
    ...props
  },
  ref,
) {
  const selectId =
    id ?? props.name;

  return (
    <label
      htmlFor={selectId}
      className="block space-y-2"
    >
      {label && (
        <span className="block text-sm font-medium text-slate-200">
          {label}
        </span>
      )}

      <select
        {...props}
        ref={ref}
        id={selectId}
        className={`
          w-full
          rounded-xl
          border
          bg-slate-950
          px-4
          py-3
          text-white
          outline-none
          focus:border-cyan-400
          focus:ring-2
          focus:ring-cyan-400/20
          ${
            error
              ? "border-red-500"
              : "border-slate-700"
          }
          ${className}
        `}
      >
        {children}
      </select>

      {error && (
        <span className="block text-sm text-red-400">
          {error}
        </span>
      )}
    </label>
  );
});

export default Select;
