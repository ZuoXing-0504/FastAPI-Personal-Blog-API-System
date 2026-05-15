import { PropsWithChildren } from "react";

import { StudioShell } from "@/components/studio/studio-shell";

export default function StudioLayout({ children }: PropsWithChildren) {
  return <StudioShell>{children}</StudioShell>;
}
