"use client";

import React, { useState } from "react";
import { IoFingerPrintOutline } from "react-icons/io5";
import { User, Lock, EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { LoginInput } from "../../api/auth/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserSchema } from "@/schemas/user.schema";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/stores/authStore";
import Cookie from "js-cookie";
import cookieKeys from "@/config/cookieKeys";
import { useLogin } from "../../api-clients/login/useLogin";
import Input from "@/compontns/Input";
import Button from "@/compontns/Button";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { CustomError } from "../../api/auth/helpers/handleError";

export const LoginForm = () => {
  const router = useRouter();
  const { setUser, setAuthToken } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    mode: "onSubmit",
    resolver: zodResolver(LoginUserSchema),
  });

  const { mutateAsync: login } = useLogin({
    invalidateQueryKey: [],
  });

  return (
    <div className="@container flex w-full flex-col items-center justify-center py-10">
      {/* Icon and Title Section */}
      <div className="flex flex-col items-center">
        <div className="relative flex aspect-square size-12 items-center justify-center">
          <div className="absolute -top-2 -right-2 size-12 rotate-12 rounded-tl-xl rounded-br-xl bg-violet-700 shadow-lg shadow-purple-600"></div>
          <div className="relative flex size-12 items-center justify-center rounded-tl-2xl rounded-br-2xl border border-b-purple-700/50 border-l-purple-700/50 border-t-white/60 border-r-white/60 bg-white/10 text-white shadow-md backdrop-blur-sm dark:border-white/10">
            <IoFingerPrintOutline className="relative size-6" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mt-5 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-1 text-center text-xs text-gray-600 dark:text-white/60">
          Sign in to your account to continue
        </p>
      </div>

      {/* Form */}
      <div className="mt-10 w-full max-w-sm">
        <form
          className="flex w-full flex-col space-y-5"
          onSubmit={handleSubmit(async (values) => {
            setLoginError("");
            try {
              const {
                data: { user, token },
              } = await login({
                body: values,
              });

              setUser(user);
              setAuthToken(token);

              Cookie.set(cookieKeys.USER_TOKEN, token);
              Cookie.set(cookieKeys.USER, JSON.stringify(user));

              router.push("/dashboard");
            } catch (error) {
              const err = error as AxiosError;
              const errObject = err.response?.data as CustomError;
              const message = errObject.error.message;
              toast.error(message);

              reset();
            }
          })}
        >
          <Input
            placeholder="Enter your username"
            leftIcon={User}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            leftIcon={Lock}
            error={errors.password?.message || loginError}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            {...register("password")}
          />

          <Button loading={isSubmitting}>Login</Button>

          <div className="flex items-center justify-center gap-2">
            <div className="w-full border-t border-gray-300 dark:border-white/10"></div>
            <p className="text-sm whitespace-nowrap text-gray-500 dark:text-white/60">
              or continue with
            </p>
            <div className="w-full border-t border-gray-300 dark:border-white/10"></div>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-5 @xl:flex-row">
            {/* Google Button */}
            <div className="w-full">
              <Button
                type="button"
                className="btn-ghost relative flex w-full cursor-pointer touch-none items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-gray-300 bg-[var(--color-btn)] p-3 text-sm font-medium text-[var(--color-btn-text)] ring-[var(--color-btn-ring)] ring-offset-2 ring-offset-inherit outline-none select-none hover:border-gray-400 hover:bg-[var(--color-btn-hover)] focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-[var(--color-btn-disabled)] disabled:text-[var(--color-btn-text-disabled)] data-[focus-visible]:ring-2 data-[pressed]:bg-[var(--color-btn-active)] md:p-3 dark:border-white/20 dark:bg-[var(--color-btn-dark)] dark:text-white dark:hover:border-white/30 dark:disabled:border-white/10 dark:disabled:bg-white/10 dark:disabled:text-white/30"
                tabIndex={0}
              >
                <span
                  className="relative flex items-center px-2.5"
                  aria-live="polite"
                  aria-busy="false"
                >
                  <div className="flex w-full items-center justify-center peer-disabled:text-white">
                    {/* Google SVG */}
                    <svg
                      className="size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                      />
                    </svg>
                    <p className="ml-2">Google</p>
                  </div>
                </span>
              </Button>
            </div>

            {/* Microsoft Button */}
            <div className="w-full">
              <Button
                type="button"
                className="btn-ghost relative flex w-full cursor-pointer touch-none items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-gray-300 bg-[var(--color-btn)] p-3 text-sm font-medium text-[var(--color-btn-text)] ring-[var(--color-btn-ring)] ring-offset-2 ring-offset-inherit outline-none select-none hover:border-gray-400 hover:bg-[var(--color-btn-hover)] focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-[var(--color-btn-disabled)] disabled:text-[var(--color-btn-text-disabled)] data-[focus-visible]:ring-2 data-[pressed]:bg-[var(--color-btn-active)] md:p-3 dark:border-white/20 dark:bg-[var(--color-btn-dark)] dark:text-white dark:hover:border-white/30 dark:disabled:border-white/10 dark:disabled:bg-white/10 dark:disabled:text-white/30"
                tabIndex={0}
              >
                <span
                  className="relative flex items-center px-2.5"
                  aria-live="polite"
                  aria-busy="false"
                >
                  <div className="flex w-full items-center justify-center">
                    {/* Microsoft SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      viewBox="0 0 256 256"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z" />
                      <path fill="#80cc28" d="M256 121.666H134.335V0H256z" />
                      <path
                        fill="#00adef"
                        d="M121.663 256.002H0V134.336h121.663z"
                      />
                      <path
                        fill="#fbbc09"
                        d="M256 256.002H134.335V134.336H256z"
                      />
                    </svg>
                    <p className="ml-2">Microsoft</p>
                  </div>
                </span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
