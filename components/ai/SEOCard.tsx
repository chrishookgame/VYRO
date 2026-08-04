"use client";

import {
  Search,
  Hash,
  Globe,
  Sparkles,
} from "lucide-react";

type SEOCardProps = {
  title: string;
  description: string;
  keywords: string[];
  hashtags: string[];
};

export default function SEOCard({
  title,
  description,
  keywords,
  hashtags,
}: SEOCardProps) {
  return (
    <div className="rounded-2xl border border-cyan-700 bg-slate-900 p-6">

      <div className="mb-6 flex items-center gap-3">
        <Search className="text-cyan-400" />
        <h2 className="text-2xl font-bold text-cyan-400">
          SEO Optimization
        </h2>
      </div>

      <div className="space-y-5">

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={18} />
            <span className="font-semibold">
              Title
            </span>
          </div>

          <div className="rounded-lg bg-slate-800 p-4">
            {title}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Globe size={18} />
            <span className="font-semibold">
              Description
            </span>
          </div>

          <div className="rounded-lg bg-slate-800 p-4">
            {description}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Search size={18} />
            <span className="font-semibold">
              Keywords
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {keywords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="rounded-full bg-cyan-600 px-3 py-1 text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Hash size={18} />
            <span className="font-semibold">
              Hashtags
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-full bg-violet-600 px-3 py-1 text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

