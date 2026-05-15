import type { Metadata } from "next";

import { AuthFormCard } from "@/components/auth/auth-form-card";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an author account for the FastAPI Personal Blog studio.",
};

type RegisterPageProps = {
  searchParams?: Promise<{
    redirect?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = searchParams ? await searchParams : {};

  return (
    <AuthFormCard
      mode="register"
      redirectTarget={params.redirect || "/studio"}
    />
  );
}
