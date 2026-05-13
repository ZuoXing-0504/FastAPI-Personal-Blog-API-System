import { cn } from "@/lib/utils";

type SkeletonBlockProps = {
  className?: string;
};

export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return (
    <div
      className={cn(
        "rounded-card animate-pulse bg-gradient-to-r from-black/6 via-black/10 to-black/6",
        className,
      )}
    />
  );
}
