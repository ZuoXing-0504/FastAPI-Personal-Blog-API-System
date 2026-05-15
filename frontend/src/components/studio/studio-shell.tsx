"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import {
  BookCopy,
  FolderKanban,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { logoutUser } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    href: "/studio",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/studio/articles",
    label: "Articles",
    icon: BookCopy,
  },
  {
    href: "/studio/categories",
    label: "Categories",
    icon: FolderKanban,
  },
  {
    href: "/studio/profile",
    label: "Profile",
    icon: UserRound,
  },
];

export function StudioShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const { clearSession, hasHydrated, isAuthenticated, refreshToken, user } =
    useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/studio")}`);
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      if (refreshToken) {
        await logoutUser({
          refresh_token: refreshToken,
        });
      }
    } catch {
      toast.error("退出登录请求失败，已为你清理本地会话。");
    } finally {
      clearSession();
      toast.success("你已退出登录。");
      setIsLoggingOut(false);
      router.push("/login");
      router.refresh();
    }
  }

  if (!hasHydrated || !isAuthenticated || !user) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center px-6">
        <div className="surface-card flex max-w-md flex-col items-center gap-4 rounded-[2rem] px-8 py-10 text-center">
          <LoaderCircle className="text-accent size-8 animate-spin" />
          <div className="space-y-2">
            <h1 className="editorial-title text-2xl text-black">
              Securing your studio
            </h1>
            <p className="editorial-copy text-sm">
              We are checking your session and redirecting to the login page if
              needed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-background via-background to-accent-soft/25 min-h-screen bg-gradient-to-br">
      <div className="mx-auto grid min-h-screen max-w-[1440px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 lg:py-6">
        <aside className="surface-card flex flex-col rounded-[2rem] p-5 lg:p-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="bg-accent text-background flex size-12 items-center justify-center rounded-2xl text-sm font-semibold tracking-[0.22em] uppercase shadow-[0_10px_30px_rgba(31,79,255,0.22)]">
              FP
            </span>
            <div className="space-y-1">
              <p className="editorial-title text-lg text-black">Studio</p>
              <p className="text-muted text-xs tracking-[0.16em] uppercase">
                Author workspace
              </p>
            </div>
          </Link>

          <nav className="mt-8 flex flex-1 flex-col gap-2">
            {navigationItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href ||
                (href !== "/studio" && pathname?.startsWith(`${href}/`));

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm transition-colors",
                    isActive
                      ? "bg-black text-white"
                      : "text-muted hover:bg-white/80 hover:text-black",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="rounded-[1.5rem] border border-black/8 bg-white/70 p-4">
            <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
              Signed in as
            </p>
            <p className="editorial-title mt-2 text-xl text-black">
              {user.username}
            </p>
            <p className="editorial-copy mt-1 text-sm">{user.email}</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <header className="surface-card flex flex-col gap-4 rounded-[2rem] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="space-y-2">
              <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
                Protected route
              </p>
              <div>
                <h1 className="editorial-title text-3xl text-black">
                  Writing studio
                </h1>
                <p className="editorial-copy text-sm sm:text-base">
                  This area is gated by the persisted JWT session and refresh
                  token flow from step 8.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-muted inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium transition-colors hover:border-black/18 hover:text-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut className="size-4" />
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </button>
          </header>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
