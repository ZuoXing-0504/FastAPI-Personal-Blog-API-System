import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface-card rounded-panel flex flex-col items-start gap-5 p-8",
        className,
      )}
    >
      {icon ? (
        <div className="text-accent rounded-pill bg-accent-soft flex size-12 items-center justify-center">
          {icon}
        </div>
      ) : null}
      <div className="space-y-2">
        <h3 className="editorial-title text-2xl text-black">{title}</h3>
        <p className="editorial-copy max-w-xl text-base">{description}</p>
      </div>
      {action}
    </div>
  );
}
