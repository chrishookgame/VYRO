"use client";

export type TabItem = {
  id: string;
  label: string;
};

export type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
};

export default function Tabs({
  items,
  value,
  onChange,
}: TabsProps) {
  return (
    <div
      role="tablist"
      className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900 p-2"
    >
      {items.map((item) => {
        const active =
          item.id === value;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() =>
              onChange(item.id)
            }
            className={`
              rounded-lg
              px-4
              py-2
              text-sm
              font-semibold
              transition
              ${
                active
                  ? "bg-cyan-500 text-black"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }
            `}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
