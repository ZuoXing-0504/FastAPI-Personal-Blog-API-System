"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";
import { Toaster } from "sonner";

import { makeQueryClient } from "@/lib/query-client";

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" closeButton />
      {process.env.NEXT_PUBLIC_ENABLE_QUERY_DEVTOOLS === "true" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
