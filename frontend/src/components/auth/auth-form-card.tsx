"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { toast } from "sonner";

import { registerUser, loginUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";

type AuthFormCardProps = {
  mode: AuthMode;
  redirectTarget?: string;
  registeredNotice?: string | null;
};

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedMap = Partial<Record<FieldName, boolean>>;

const initialValues: FormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const usernamePattern = /^[A-Za-z0-9_]{3,20}$/;

function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePassword(value: string) {
  if (value.length < 6 || value.length > 32) {
    return "密码长度需为 6-32 位。";
  }

  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return "密码需同时包含字母和数字。";
  }

  return null;
}

function validateValues(mode: AuthMode, values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const username = values.username.trim();
  const email = values.email.trim();
  const password = values.password.trim();
  const confirmPassword = values.confirmPassword.trim();

  if (!username) {
    errors.username = "请输入用户名。";
  } else if (!usernamePattern.test(username)) {
    errors.username = "用户名需为 3-20 位字母、数字或下划线。";
  }

  if (!password) {
    errors.password = "请输入密码。";
  } else if (mode === "register") {
    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
    }
  }

  if (mode === "register") {
    if (!email) {
      errors.email = "请输入邮箱地址。";
    } else if (!validateEmail(email)) {
      errors.email = "请输入有效的邮箱地址。";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "请再次输入密码。";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "两次输入的密码不一致。";
    }
  }

  return errors;
}

function AuthField({
  label,
  name,
  type,
  value,
  placeholder,
  hint,
  error,
  onChange,
  onBlur,
}: {
  label: string;
  name: FieldName;
  type: "text" | "email" | "password";
  value: string;
  placeholder: string;
  hint?: string;
  error?: string;
  onChange: (field: FieldName, value: string) => void;
  onBlur: (field: FieldName) => void;
}) {
  return (
    <label className="space-y-2.5">
      <span className="text-sm font-semibold text-black">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
        onBlur={() => onBlur(name)}
        className={cn(
          "w-full rounded-[1.35rem] border bg-white/90 px-4 py-3.5 text-sm text-black transition-colors placeholder:text-black/28",
          "focus-visible:border-accent",
          error ? "border-danger/60" : "border-black/10",
        )}
      />
      {error ? (
        <span className="text-danger inline-flex items-center gap-2 text-sm">
          <CircleAlert className="size-4" />
          {error}
        </span>
      ) : hint ? (
        <span className="text-muted text-sm">{hint}</span>
      ) : null}
    </label>
  );
}

export function AuthFormCard({
  mode,
  redirectTarget = "/studio",
  registeredNotice = null,
}: AuthFormCardProps) {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [touched, setTouched] = useState<TouchedMap>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = validateValues(mode, values);
  const isRegister = mode === "register";

  function updateField(field: FieldName, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    if (successMessage) {
      setSuccessMessage(null);
    }

    if (submitError) {
      setSubmitError(null);
    }
  }

  function markTouched(field: FieldName) {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    setSubmitError(null);

    const nextTouched: TouchedMap = {
      username: true,
      password: true,
    };

    if (isRegister) {
      nextTouched.email = true;
      nextTouched.confirmPassword = true;
    }

    setTouched((current) => ({
      ...current,
      ...nextTouched,
    }));

    if (Object.keys(errors).length > 0) {
      toast.error("表单校验未通过，请先修正输入内容。");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegister) {
        const user = await registerUser({
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password.trim(),
        });

        setSuccessMessage(`账号 ${user.username} 已创建成功，正在跳转到登录页。`);
        toast.success("注册成功，请继续登录。");
        router.push(
          `/login?registered=1&redirect=${encodeURIComponent(redirectTarget)}`,
        );
        router.refresh();
      } else {
        const session = await loginUser({
          username: values.username.trim(),
          password: values.password.trim(),
        });

        setSession({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          user: session.user,
        });

        setSuccessMessage("登录成功，正在进入创作后台。");
        toast.success("登录成功。");
        router.push(redirectTarget);
        router.refresh();
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "认证请求失败，请检查后端服务是否启动。";

      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const title = isRegister ? "Create your author account" : "Welcome back";
  const description = isRegister
    ? "Use the same validation rules as the FastAPI backend, then move straight into category and article creation."
    : "Sign in to access the studio, manage your articles, and demonstrate the protected writing workflow.";
  const buttonLabel = isRegister ? "Validate and continue" : "Validate sign-in";

  return (
    <div className="surface-card rounded-[2rem] p-6 sm:p-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="inline-flex rounded-full border border-black/10 bg-white/80 p-1">
            <Link
              href="/login"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                !isRegister ? "bg-black text-white" : "text-muted hover:text-black",
              )}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isRegister ? "bg-black text-white" : "text-muted hover:text-black",
              )}
            >
              Register
            </Link>
          </div>

          <div className="space-y-3">
            <h2 className="editorial-title text-4xl text-black">{title}</h2>
            <p className="editorial-copy text-base">{description}</p>
          </div>
        </div>

        {registeredNotice && !successMessage ? (
          <div className="rounded-[1.4rem] border border-blue-600/15 bg-blue-50 px-4 py-3.5 text-sm text-blue-950">
            <span className="inline-flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              {registeredNotice}
            </span>
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-[1.4rem] border border-emerald-600/20 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-900">
            <span className="inline-flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              {successMessage}
            </span>
          </div>
        ) : null}

        {submitError ? (
          <div className="rounded-[1.4rem] border border-red-600/15 bg-red-50 px-4 py-3.5 text-sm text-red-900">
            <span className="inline-flex items-start gap-2">
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              {submitError}
            </span>
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <AuthField
            label="Username"
            name="username"
            type="text"
            value={values.username}
            placeholder="例如：zuoxing_0504"
            hint="3-20 位，仅支持字母、数字与下划线。"
            error={touched.username || hasSubmitted ? errors.username : undefined}
            onChange={updateField}
            onBlur={markTouched}
          />

          {isRegister ? (
            <AuthField
              label="Email"
              name="email"
              type="email"
              value={values.email}
              placeholder="you@example.com"
              hint="注册成功后会返回不含密码的用户信息。"
              error={touched.email || hasSubmitted ? errors.email : undefined}
              onChange={updateField}
              onBlur={markTouched}
            />
          ) : null}

          <AuthField
            label="Password"
            name="password"
            type="password"
            value={values.password}
            placeholder={isRegister ? "至少 6 位，需包含字母和数字" : "请输入你的密码"}
            hint={
              isRegister
                ? "密码需为 6-32 位，并同时包含字母与数字。"
                : "后端会返回明确的用户名或密码错误提示。"
            }
            error={touched.password || hasSubmitted ? errors.password : undefined}
            onChange={updateField}
            onBlur={markTouched}
          />

          {isRegister ? (
            <AuthField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              placeholder="再次输入密码"
              hint="确认密码与主密码保持一致。"
              error={
                touched.confirmPassword || hasSubmitted
                  ? errors.confirmPassword
                  : undefined
              }
              onChange={updateField}
              onBlur={markTouched}
            />
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-accent text-background flex w-full items-center justify-center rounded-[1.35rem] px-4 py-3.5 text-sm font-semibold shadow-[0_18px_40px_rgba(31,79,255,0.22)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : buttonLabel}
          </button>
        </form>

        <div className="rounded-[1.5rem] border border-black/8 bg-white/65 px-4 py-4 text-sm">
          <p className="font-semibold text-black">Current milestone</p>
          <p className="editorial-copy mt-2">
            Registration and login now talk to the real FastAPI backend. The
            next step expands this into a protected studio layout, article
            management flow, and category workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
