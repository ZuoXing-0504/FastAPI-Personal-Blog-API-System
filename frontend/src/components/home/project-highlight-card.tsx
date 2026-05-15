import { LucideIcon } from "lucide-react";

type ProjectHighlightCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function ProjectHighlightCard({
  title,
  description,
  icon: Icon,
}: ProjectHighlightCardProps) {
  return (
    <article className="surface-card rounded-card h-full p-6">
      <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-black text-white shadow-[0_14px_28px_rgba(20,20,20,0.12)]">
        <Icon className="size-5" />
      </div>
      <div className="space-y-3">
        <h3 className="editorial-title text-2xl text-black">{title}</h3>
        <p className="editorial-copy text-base">{description}</p>
      </div>
    </article>
  );
}
