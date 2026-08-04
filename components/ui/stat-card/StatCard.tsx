import type {
  ReactNode,
} from "react";

export type StatCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  className?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  description,
  className = "",
}: StatCardProps) {
  return (
    <article
      className={`
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        p-6
        text-white
        shadow-lg
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-cyan-300">
            {value}
          </p>
        </div>

        {icon && (
          <div className="text-4xl">
            {icon}
          </div>
        )}
      </div>

      {description && (
        <p className="mt-4 text-sm text-slate-500">
          {description}
        </p>
      )}
    </article>
  );
}
