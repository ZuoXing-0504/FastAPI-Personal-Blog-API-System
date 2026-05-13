import { ArrowRight, Sparkles } from "lucide-react";

import { Container } from "@/components/common/container";
import { EmptyState } from "@/components/common/empty-state";
import { SectionHeading } from "@/components/common/section-heading";
import { SkeletonBlock } from "@/components/common/skeleton-block";

export default function Home() {
  return (
    <main className="py-16 sm:py-20">
      <Container className="space-y-12">
        <section className="surface-card rounded-panel grid gap-10 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Public Shell Ready"
              title="The shared blog layout is in place and ready for real content."
              description="Header, footer, spacing rules, empty states, and common visual language are now prepared for the next page-building steps."
            />
            <div className="flex flex-wrap gap-3 text-sm text-black/75">
              <span className="rounded-pill border-line bg-surface border px-4 py-2">
                Shared header and footer
              </span>
              <span className="rounded-pill border-line bg-surface border px-4 py-2">
                Reusable content container
              </span>
              <span className="rounded-pill border-line bg-surface border px-4 py-2">
                Empty and loading states
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <SkeletonBlock className="h-28 w-full" />
            <SkeletonBlock className="h-28 w-full" />
            <SkeletonBlock className="h-28 w-full" />
          </div>
        </section>

        <EmptyState
          icon={<Sparkles className="size-5" />}
          title="Step 4 will turn this into the real homepage."
          description="The next implementation step focuses on the actual front-page experience: hero section, latest articles, category strip, and project highlights."
          action={
            <div className="text-accent inline-flex items-center gap-2 text-sm font-medium">
              Next up: homepage design
              <ArrowRight className="size-4" />
            </div>
          }
        />
      </Container>
    </main>
  );
}
