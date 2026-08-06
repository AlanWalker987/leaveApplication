'use client';

import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthShell, MessagePopup, SubmitButton } from '../../../../components';
import { type LoginFormValues, loginSchema } from '../schemas/form-schemas';
import { LOGIN_USER } from '../graphql/operations';
import {
  getRoleHomePath,
  getUserRoleFromSession,
  hasAccessToken,
  persistAuthSession,
} from '../utils/session';

export function LoginPageFeature() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [popupState, setPopupState] = useState<{
    open: boolean;
    message: string;
    tone: 'error' | 'success' | 'info';
  }>({
    open: false,
    message: '',
    tone: 'info',
  });
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  useEffect(() => {
    const prefilledEmail = searchParams.get('email');
    if (prefilledEmail) {
      setValue('email', prefilledEmail, { shouldValidate: true });
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    if (!hasAccessToken()) {
      return;
    }

    const role = getUserRoleFromSession();
    if (!role) {
      return;
    }

    router.replace(getRoleHomePath(role));
  }, [router]);

  const fromRegistration = searchParams.get('registered') === '1';

  useEffect(() => {
    if (fromRegistration) {
      setPopupState({
        open: true,
        message: 'Registration successful. Please login to continue.',
        tone: 'success',
      });
    }
  }, [fromRegistration]);

  async function onSubmit(form: LoginFormValues) {
    setPopupState((prev) => ({ ...prev, open: false }));

    try {
      const { data } = await loginUser({
        variables: {
          input: {
            email: form.email.trim().toLowerCase(),
            password: form.password,
          },
        },
      });

      if (!data?.login) {
        setPopupState({
          open: true,
          message: 'Login failed. Please check your credentials.',
          tone: 'error',
        });
        return;
      }

      persistAuthSession(data.login);
      const role = getUserRoleFromSession();
      router.push(role ? getRoleHomePath(role) : '/employee');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to login.';
      setPopupState({ open: true, message, tone: 'error' });
    }
  }

  return (
    <AuthShell
      hideHeader
      fullPage
      frame="plain"
      maxWidthClassName="max-w-none"
      title="Login"
      description=""
    >
      <MessagePopup
        message={popupState.message}
        onClose={() => setPopupState((prev) => ({ ...prev, open: false }))}
        open={popupState.open}
        tone={popupState.tone}
      />

      <form
        className="mx-auto h-full w-full max-w-none overflow-hidden px-3 py-3 md:px-5 md:py-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid h-full overflow-hidden rounded-[28px] border border-[#e4defe] bg-white shadow-[0_16px_42px_rgba(36,27,90,0.14)] xl:grid-cols-[44%_56%]">
          <aside className="relative hidden h-full flex-col overflow-hidden bg-gradient-to-b from-[#f7f4ff] via-[#f4f0ff] to-[#f8f6ff] p-8 xl:flex">
            <div className="pointer-events-none absolute -right-10 top-12 h-20 w-20 rounded-full bg-[#e8e0ff] blur-xl" />
            <div className="pointer-events-none absolute left-6 top-[44%] h-12 w-12 rounded-full bg-[#dcd0ff] blur-lg" />

            <div className="flex items-center gap-3">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6246ea] shadow-[0_8px_20px_rgba(50,34,114,0.25)]">
                <svg fill="none" height="28" viewBox="0 0 24 24" width="28">
                  <rect
                    x="4"
                    y="5"
                    width="16"
                    height="15"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 3v4M16 3v4M7.5 10.5h9"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <path
                    d="m9.5 15 2 2 3.5-4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6393]">
                Leave Management
              </span>
            </div>

            <h2 className="mt-8 font-heading text-[34px] leading-[1.1] text-[#2f2b5b]">
              Welcome Back!
            </h2>
            <p className="mt-1.5 font-heading text-[30px] leading-[1.12] text-[#2f2b5b]">
              Great to have you back.
            </p>

            <div className="mt-7 h-[2px] w-16 bg-[#d7ccff]" />
            <p className="mt-5 max-w-[260px] text-sm leading-[1.45] text-[#5f6393]">
              Manage leaves, approvals and balances seamlessly in one place.
            </p>

            <div className="relative mt-auto rounded-2xl border border-[#e4defe] bg-white/75 px-6 py-4 backdrop-blur-sm">
              <div className="grid grid-cols-3 divide-x divide-[#ebe5ff] text-center">
                <div className="px-2">
                  <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c9bbf7] text-[#6246ea]">
                    <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
                      <path
                        d="m5 12 14-7-4 14-3-5-7-2Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </span>
                  <p className="mt-2 text-[14px] font-medium leading-[1.3] text-[#5f6393]">
                    Submit Leave in seconds
                  </p>
                </div>
                <div className="px-2">
                  <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c9bbf7] text-[#6246ea]">
                    <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
                      <path
                        d="M4 19V5m5 14V9m5 10V12m5 7V7"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </span>
                  <p className="mt-2 text-[14px] font-medium leading-[1.3] text-[#5f6393]">
                    Track Status in real time
                  </p>
                </div>
                <div className="px-2">
                  <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c9bbf7] text-[#6246ea]">
                    <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
                      <path
                        d="M12 22a3 3 0 0 0 2.9-2.2M5 16h14l-1.2-1.6A5 5 0 0 1 17 11V9a5 5 0 1 0-10 0v2c0 1.2-.4 2.4-1.2 3.4L5 16Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </span>
                  <p className="mt-2 text-[14px] font-medium leading-[1.3] text-[#5f6393]">
                    Stay Updated always
                  </p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-10 bottom-24 h-[32%] opacity-95">
              <Image
                src="/images/register-side-illustration.svg"
                alt="Leave management illustration"
                fill
                sizes="520px"
                className="object-contain object-bottom"
              />
            </div>
          </aside>

          <section className="flex h-full min-h-0 overflow-y-auto bg-white px-6 py-8 md:px-9 md:py-10 xl:px-12">
            <div className="m-auto w-full max-w-[520px]">
              <header>
                <h1 className="text-[24px] font-semibold text-[#1f2940] md:text-[26px]">
                  Sign in to your account
                </h1>
                <p className="mt-1 text-sm text-[#6e7890]">
                  Use your work credentials to continue.
                </p>
              </header>

              <div className="mt-8 space-y-6">
                <label className="block text-sm font-semibold text-[#1f2a3b]">
                  Work Email
                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#7f8a9b]">
                      <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <path
                          d="m5 8 7 5 7-5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </span>
                    <input
                      type="email"
                      className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-white pl-12 pr-4 text-[14px] text-[#1f2937] outline-none transition focus:border-[#6246ea] focus:ring-2 focus:ring-[color:rgba(98,70,234,0.14)]"
                      placeholder="Enter your work email"
                      {...register('email')}
                    />
                  </div>
                  {errors.email?.message ? (
                    <span className="mt-1 block text-xs font-medium text-[var(--color-danger)]">
                      {errors.email.message}
                    </span>
                  ) : null}
                </label>

                <label className="block text-sm font-semibold text-[#1f2a3b]">
                  Password
                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#7f8a9b]">
                      <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="no-native-password-toggle h-11 w-full rounded-xl border border-[#d8e2f0] bg-white pl-12 pr-12 text-[14px] text-[#1f2937] outline-none transition focus:border-[#6246ea] focus:ring-2 focus:ring-[color:rgba(98,70,234,0.14)]"
                      placeholder="Enter your password"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#7f8a9b] hover:text-[#4e5c6f]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? (
                        <svg fill="none" height="19" viewBox="0 0 24 24" width="19">
                          <path
                            d="M3 3l18 18"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="1.7"
                          />
                          <path
                            d="M10.7 6.5A8.8 8.8 0 0 1 12 6c6.5 0 10.5 6 10.5 6a20.6 20.6 0 0 1-4.2 4.7"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />
                          <path
                            d="M6.1 9.2A20.5 20.5 0 0 0 1.5 12s4 6 10.5 6c1.4 0 2.7-.3 3.8-.8"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />
                          <path
                            d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />
                        </svg>
                      ) : (
                        <svg fill="none" height="19" viewBox="0 0 24 24" width="19">
                          <path
                            d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password?.message ? (
                    <span className="mt-1 block text-xs font-medium text-[var(--color-danger)]">
                      {errors.password.message}
                    </span>
                  ) : null}
                </label>
              </div>

              <div className="mt-7">
                <SubmitButton
                  className="h-11 w-full rounded-xl bg-black text-white shadow-[0_12px_24px_rgba(0,0,0,0.28)] hover:bg-[#1a1a1a]"
                  idleLabel="Sign In"
                  loading={loading}
                  loadingLabel="Signing in..."
                />
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-[#8a9bb3]">
                <span className="h-px flex-1 bg-[#e2e8f3]" />
                <span className="font-medium text-[#7d8aa0]">or</span>
                <span className="h-px flex-1 bg-[#e2e8f3]" />
              </div>

              <p className="mt-5 text-center text-sm text-[#6e7890]">
                New user?{' '}
                <Link
                  className="font-semibold text-[#4f46e5] hover:text-[#4338ca]"
                  href="/register"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </form>
    </AuthShell>
  );
}
