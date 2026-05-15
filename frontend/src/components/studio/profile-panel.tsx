"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FilePenLine, LoaderCircle, ShieldCheck, UserRound } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { SkeletonBlock } from "@/components/common/skeleton-block";
import { useAuth } from "@/hooks/use-auth";
import { getCurrentUser } from "@/lib/api/auth";
import { formatDateLabel, formatDateTimeLabel } from "@/lib/utils";

export function ProfilePanel() {
  const { accessToken, refreshToken, user: persistedUser } = useAuth();

  const profileQuery = useQuery({
    queryKey: ["users", "me"],
    queryFn: getCurrentUser,
  });

  if (profileQuery.isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-16 w-full rounded-[2rem]" />
        <SkeletonBlock className="h-72 w-full rounded-[2rem]" />
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <EmptyState
        title="Failed to load profile"
        description="The current user profile could not be fetched from the protected API."
        icon={<LoaderCircle className="size-5" />}
      />
    );
  }

  const profile = profileQuery.data;

  return (
    <div className="space-y-6">
      <section className="surface-card rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="editorial-eyebrow">Account center</span>
            <div className="space-y-3">
              <h2 className="editorial-title text-4xl text-black sm:text-5xl">
                Your author profile is synced with the protected API.
              </h2>
              <p className="editorial-copy max-w-3xl text-base sm:text-lg">
                This page combines persisted session data with a live `/users/me`
                request so the studio can trust both local auth state and
                backend verification.
              </p>
            </div>
          </div>

          <Link
            href="/studio/articles/new"
            className="bg-black text-white inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
          >
            <FilePenLine className="size-4" />
            Write a new article
          </Link>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="surface-card rounded-[2rem] px-6 py-6 sm:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-black/8 bg-white/70 p-5">
              <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
                Username
              </p>
              <p className="editorial-title mt-3 text-2xl text-black">
                {profile.username}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-black/8 bg-white/70 p-5">
              <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
                Email
              </p>
              <p className="mt-3 text-base font-medium text-black">{profile.email}</p>
            </div>
            <div className="rounded-[1.5rem] border border-black/8 bg-white/70 p-5">
              <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
                Created
              </p>
              <p className="mt-3 text-base font-medium text-black">
                {formatDateTimeLabel(profile.created_at)}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-black/8 bg-white/70 p-5">
              <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
                Updated
              </p>
              <p className="mt-3 text-base font-medium text-black">
                {formatDateTimeLabel(profile.updated_at)}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <section className="surface-card rounded-[2rem] px-6 py-6">
            <div className="flex items-start gap-4">
              <div className="bg-accent-soft text-accent inline-flex size-12 items-center justify-center rounded-2xl">
                <UserRound className="size-5" />
              </div>
              <div className="space-y-2">
                <h3 className="editorial-title text-2xl text-black">
                  Session snapshot
                </h3>
                <p className="editorial-copy text-sm">
                  Persisted user: {persistedUser?.username || "Unavailable"}
                </p>
                <p className="editorial-copy text-sm">
                  Access token: {accessToken ? "Loaded" : "Missing"}
                </p>
                <p className="editorial-copy text-sm">
                  Refresh token: {refreshToken ? "Loaded" : "Missing"}
                </p>
              </div>
            </div>
          </section>

          <section className="surface-card rounded-[2rem] px-6 py-6">
            <div className="flex items-start gap-4">
              <div className="bg-accent-soft text-accent inline-flex size-12 items-center justify-center rounded-2xl">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-3">
                <h3 className="editorial-title text-2xl text-black">
                  Account status
                </h3>
                <p className="editorial-copy text-sm">
                  {profile.is_active
                    ? "当前账号处于启用状态，可以继续发布、编辑和删除自己的文章。"
                    : "当前账号已被停用，写作能力会受到限制。"}
                </p>
                <p className="editorial-copy text-sm">
                  Member since {formatDateLabel(profile.created_at)}.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
