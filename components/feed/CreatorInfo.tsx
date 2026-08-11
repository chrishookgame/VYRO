import Link from "next/link";

import FollowButton from "./FollowButton";

type CreatorInfoProps = {
  creatorId: string;
  creator: string;
  description: string;
};

export default function CreatorInfo({
  creatorId,
  creator,
  description,
}: CreatorInfoProps) {
  return (
    <div className="max-w-[75%] pb-8 text-white">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 backdrop-blur-md">
        <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

        <span className="text-xs font-semibold tracking-widest text-cyan-300">
          VYRO CREATOR
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link
          href={`/profile/${creatorId}`}
          className="text-2xl font-black tracking-wide transition hover:text-cyan-300"
        >
          @{creator}
        </Link>

        <FollowButton
          creatorId={creatorId}
        />
      </div>

      <p className="mt-3 text-base leading-7 text-zinc-200">
        {description}
      </p>

      <p className="mt-5 text-sm font-semibold text-cyan-300">
        #VYRO #AI #Future #Creator
      </p>
    </div>
  );
}
