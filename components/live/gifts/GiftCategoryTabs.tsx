"use client";

import type {
  LiveGiftCategory,
} from "@/lib/live";

interface GiftCategoryTabsProps {
  categories: LiveGiftCategory[];
  selectedCategory: string | null;
  onSelectCategory: (
    categoryCode: string,
  ) => void;
}

export default function GiftCategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: GiftCategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category.code}
          type="button"
          onClick={() => {
            onSelectCategory(category.code);
          }}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
            selectedCategory === category.code
              ? "border-cyan-300 bg-cyan-300 text-black"
              : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-cyan-400/40"
          }`}
        >
          <span className="mr-2">
            {category.icon}
          </span>

          {category.name}
        </button>
      ))}
    </div>
  );
}
