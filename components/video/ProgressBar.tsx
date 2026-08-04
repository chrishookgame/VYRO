type ProgressBarProps = {
  progress: number;
};

export default function ProgressBar({
  progress,
}: ProgressBarProps) {
  return (
    <div className="absolute top-0 left-0 z-30 h-1 w-full bg-white/10">
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-violet-500 transition-all duration-150"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}