import type { Metadata } from "next";

import { AuthFormCard } from "@/components/auth/auth-form-card";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the FastAPI Personal Blog writing studio.",
};

type LoginPageProps = {
  searchParams?: Promise<{
    registered?: string;
    redirect?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};

  return (
    <AuthFormCard
      mode="login"
      redirectTarget={params.redirect || "/studio"}
      registeredNotice={
        params.registered === "1"
          ? "注册成功，现在登录即可进入创作后台。"
          : null
      }
    />
  );
}
