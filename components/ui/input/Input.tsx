import {
  forwardRef,
} from "react";

import type {
  InputHTMLAttributes,
} from "react";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<
  HTMLInputElement,
  InputProps
>(function Input(
  {
    label,
    error,
    helperText,
    className = "",
    id,
    ...props
  },
  ref,
) {
  const inputId =
    id ?? props.name;

  return (
    <label
      htmlFor={inputId}
      className="block space-y-2"
    >
      {label && (
        <span className="block text-sm font-medium text-slate-200">
          {label}
        </span>
      )}

      <input
        {...props}
        ref={ref}
        id={inputId}
        className={`
          w-full
          rounded-xl
          border
          bg-slate-950
          px-4
          py-3
          text-white
          outline-none
          placeholder:text-slate-500
          focus:border-cyan-400
          focus:ring-2
          focus:ring-cyan-400/20
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${
            error
              ? "border-red-500"
              : "border-slate-700"
          }
          ${className}
        `}
      />

      {error ? (
        <span className="block text-sm text-red-400">
          {error}
        </span>
      ) : helperText ? (
        <span className="block text-sm text-slate-500">
          {helperText}
        </span>
      ) : null}
    </label>
  );
});

export default Input;
