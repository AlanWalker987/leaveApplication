'use client';

import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BriefcaseBusiness, Lock, Phone, UserRound } from 'lucide-react';
import { AuthShell, MessagePopup, SubmitButton } from '../../../../components';
import { SelectInput, TextInput } from '../../../../components/form';
import { type RegisterFormValues, registerSchema } from '../schemas/form-schemas';
import { REGISTER_USER } from '../graphql/operations';
import { AccordionSection, Field } from '../components';
import {
  type SectionKey,
  initialOpenSections,
  sectionFieldMap,
  sectionOrder,
} from '../utils/register-sections';
import { initialFormState, inputClass, normalizeTenDigitPhoneInput } from '../utils/register-form';
import { toIsoDateTime } from '@/lib/datetimeutile';

export function RegisterPageFeature() {
  const router = useRouter();
  const prevSubmitCountRef = useRef(0);
  const [popupState, setPopupState] = useState<{
    open: boolean;
    message: string;
    tone: 'error' | 'success' | 'info';
  }>({
    open: false,
    message: '',
    tone: 'info',
  });
  const [pendingLoginRedirect, setPendingLoginRedirect] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openSections, setOpenSections] =
    useState<Record<SectionKey, boolean>>(initialOpenSections);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: initialFormState,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [registerUser, { loading: registerLoading }] = useMutation(REGISTER_USER);

  const sectionErrorMap = useMemo(
    () => ({
      personal: sectionFieldMap.personal.some((field) => Boolean(errors[field])),
      security: sectionFieldMap.security.some((field) => Boolean(errors[field])),
      work: sectionFieldMap.work.some((field) => Boolean(errors[field])),
      emergency: sectionFieldMap.emergency.some((field) => Boolean(errors[field])),
    }),
    [errors],
  );

  const hasAnyFieldErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  function openOnlySection(section: SectionKey) {
    setOpenSections({
      personal: section === 'personal',
      security: section === 'security',
      work: section === 'work',
      emergency: section === 'emergency',
    });
  }

  useEffect(() => {
    if (submitCount === prevSubmitCountRef.current) {
      return;
    }

    prevSubmitCountRef.current = submitCount;

    if (submitCount < 1 || !hasAnyFieldErrors) {
      return;
    }

    const firstInvalidSection = sectionOrder.find((sectionKey) => sectionErrorMap[sectionKey]);
    if (!firstInvalidSection) {
      return;
    }

    openOnlySection(firstInvalidSection);
  }, [submitCount, hasAnyFieldErrors, sectionErrorMap]);

  function toggleSection(section: SectionKey) {
    openOnlySection(section);
  }

  function closePopup() {
    setPopupState((prev) => ({ ...prev, open: false }));

    if (pendingLoginRedirect) {
      router.push(pendingLoginRedirect);
      setPendingLoginRedirect(null);
    }
  }

  function handleClearForm() {
    reset(initialFormState);
    setPopupState((prev) => ({ ...prev, open: false }));
    setPendingLoginRedirect(null);
    setOpenSections(initialOpenSections);
  }

  function handleGoToLogin() {
    router.push('/login');
  }

  async function onSubmit(form: RegisterFormValues) {
    setPopupState((prev) => ({ ...prev, open: false }));
    setPendingLoginRedirect(null);

    try {
      const dateOfBirthIso = toIsoDateTime(form.dateOfBirth);
      const dateOfJoiningIso = toIsoDateTime(form.dateOfJoining);

      if (!dateOfBirthIso || !dateOfJoiningIso) {
        setPopupState({
          open: true,
          message: 'Please provide valid dates for birth and joining.',
          tone: 'error',
        });
        return;
      }

      await registerUser({
        variables: {
          input: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            userRole: form.userRole,
            phoneNumber: `+91${form.phoneNumber.trim()}`,
            designation: form.designation.trim(),
            dateOfBirth: dateOfBirthIso,
            dateOfJoining: dateOfJoiningIso,
            emergencyContactName: form.emergencyContactName.trim(),
            emergencyContactNumber: `+91${form.emergencyContactNumber.trim()}`,
            gender: form.gender.trim(),
          },
        },
      });

      const emailParam = encodeURIComponent(form.email.trim().toLowerCase());
      setPendingLoginRedirect(`/login?registered=1&email=${emailParam}`);
      setPopupState({
        open: true,
        message: 'Registration successful. Please login to continue.',
        tone: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to register user.';
      setPopupState({ open: true, message, tone: 'error' });
    }
  }

  return (
    <AuthShell
      hideHeader
      fullPage
      frame="plain"
      title="Employee Registration"
      description=""
      maxWidthClassName="max-w-none"
    >
      <MessagePopup
        message={popupState.message}
        onClose={closePopup}
        open={popupState.open}
        tone={popupState.tone}
      />

      <form
        className="mx-auto h-full w-full max-w-none overflow-hidden px-3 py-3 md:px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid h-full gap-4 xl:grid-cols-[320px_1fr]">
          <aside className="relative hidden h-full flex-col overflow-hidden rounded-2xl border border-[var(--app-border)] bg-gradient-to-b from-[var(--app-surface)] via-[var(--app-surface-2)] to-[var(--app-bg)] p-6 xl:flex">
            <div className="pointer-events-none absolute -right-10 top-4 h-28 w-28 rounded-full bg-[var(--app-electric-blue-1)] blur-2xl" />
            <div className="pointer-events-none absolute -left-6 bottom-12 h-24 w-24 rounded-full bg-[var(--app-electric-blue-1)] blur-2xl" />

            <h2 className="font-heading text-[30px] leading-[1.15] text-[var(--app-text)]">
              Simplify Leave.
            </h2>
            <p className="font-heading text-[30px] leading-[1.15] text-[var(--app-text)]">
              Focus on Work.
            </p>
            <p className="mt-3 text-sm text-[var(--app-text-muted)]">
              Create your account and manage leave seamlessly.
            </p>

            <div className="relative mt-6 min-h-0 flex-1 overflow-hidden rounded-2xl border border-[var(--app-white)]/70 bg-[var(--app-surface)]/60 shadow-[0_12px_30px_rgba(98,70,234,0.12)]">
              <Image
                src="/images/register-side-illustration.svg"
                alt="Registration side panel illustration"
                fill
                sizes="320px"
                className="object-cover"
                priority
              />
            </div>

            <p className="mt-3 text-xs font-medium text-[var(--app-text-muted)]">
              Smooth onboarding with one clean workflow.
            </p>
          </aside>

          <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 pr-3 shadow-[0_8px_30px_rgba(24,38,75,0.06)] md:p-5 md:pr-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-[22px] font-semibold text-[var(--app-text)] md:text-[24px]">
                  Employee Registration
                </h1>
              </div>
              <div className="pt-1 text-sm text-[var(--app-text-muted)]">
                <span>Already have an account? </span>
                <button
                  className="font-semibold text-[var(--app-primary)] hover:underline"
                  onClick={handleGoToLogin}
                  type="button"
                >
                  Sign in
                </button>
              </div>
            </div>

            {submitCount > 0 && hasAnyFieldErrors ? (
              <div className="flex items-start gap-2 rounded-xl border border-[color:color-mix(in_srgb,var(--app-error)_28%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-error)_8%,var(--app-bg))] px-3 py-2.5 text-sm text-[var(--app-error)]">
                <svg
                  fill="none"
                  height="18"
                  viewBox="0 0 24 24"
                  width="18"
                  className="mt-0.5 shrink-0"
                >
                  <path
                    d="M12 8v5m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
                <span>Please fill all the required fields to create an account.</span>
              </div>
            ) : null}

            <AccordionSection
              title="Personal Information"
              icon={<UserRound size={14} />}
              open={openSections.personal}
              hasError={sectionErrorMap.personal}
              showStatus={submitCount > 0}
              onToggle={() => toggleSection('personal')}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
                <Field
                  className="xl:col-span-2"
                  error={errors.firstName?.message}
                  label="First Name"
                  required
                >
                  <TextInput
                    className={inputClass(errors.firstName?.message)}
                    placeholder="Enter first name"
                    {...register('firstName')}
                  />
                </Field>

                <Field
                  className="xl:col-span-2"
                  error={errors.lastName?.message}
                  label="Last Name"
                  required
                >
                  <TextInput
                    className={inputClass(errors.lastName?.message)}
                    placeholder="Enter last name"
                    {...register('lastName')}
                  />
                </Field>

                <Field
                  className="xl:col-span-2"
                  error={errors.email?.message}
                  label="Work Email"
                  required
                >
                  <TextInput
                    className={inputClass(errors.email?.message)}
                    type="email"
                    placeholder="Enter work email"
                    {...register('email')}
                  />
                </Field>

                <Field
                  className="xl:col-span-2"
                  error={errors.phoneNumber?.message}
                  label="Phone Number"
                  required
                >
                  <div
                    className={`flex h-[42px] w-full overflow-hidden rounded-xl border bg-[var(--app-surface)] transition focus-within:ring-2 ${
                      errors.phoneNumber?.message
                        ? 'border-[var(--app-error)] focus-within:border-[var(--app-error)] focus-within:ring-[color:rgba(239,68,68,0.15)]'
                        : 'border-[var(--app-border)] focus-within:border-[var(--app-primary)] focus-within:ring-[color:rgba(98,70,234,0.14)]'
                    }`}
                  >
                    <span className="pointer-events-none flex w-[72px] shrink-0 items-center justify-center border-r border-[var(--app-border)] bg-[var(--color-surface-soft)] text-[13px] font-semibold text-[var(--app-text-muted)]">
                      +91
                    </span>
                    <input
                      className="h-full w-full border-0 bg-[var(--app-surface)] px-3 text-[14px] text-[var(--color-ink)] outline-none placeholder:text-[var(--app-text-muted)]"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Enter phone number"
                      {...register('phoneNumber', {
                        onChange: (event) => {
                          event.target.value = normalizeTenDigitPhoneInput(event.target.value);
                        },
                      })}
                    />
                  </div>
                </Field>

                <Field className="xl:col-span-2" label="Gender" required>
                  <SelectInput
                    className={inputClass(errors.userRole?.message)}
                    {...register('gender')}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </SelectInput>
                </Field>

                <Field
                  className="xl:col-span-2"
                  error={errors.dateOfBirth?.message}
                  label="Date of Birth"
                  required
                >
                  <TextInput
                    className={inputClass(errors.dateOfBirth?.message)}
                    type="date"
                    {...register('dateOfBirth')}
                  />
                </Field>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Account Security"
              icon={<Lock size={14} />}
              open={openSections.security}
              hasError={sectionErrorMap.security}
              showStatus={submitCount > 0}
              onToggle={() => toggleSection('security')}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field error={errors.password?.message} label="Password" required>
                  <div className="relative">
                    <TextInput
                      className={`no-native-password-toggle ${inputClass(errors.password?.message)} pr-10`}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--app-text-muted)] hover:text-[var(--app-text-muted)]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? (
                        <svg fill="none" height="16" viewBox="0 0 24 24" width="16">
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
                        <svg fill="none" height="16" viewBox="0 0 24 24" width="16">
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
                </Field>

                <Field error={errors.confirmPassword?.message} label="Confirm Password" required>
                  <div className="relative">
                    <TextInput
                      className={`no-native-password-toggle ${inputClass(errors.confirmPassword?.message)} pr-10`}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--app-text-muted)] hover:text-[var(--app-text-muted)]"
                      aria-label={
                        showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                      }
                      onClick={() => setShowConfirmPassword((value) => !value)}
                    >
                      {showConfirmPassword ? (
                        <svg fill="none" height="16" viewBox="0 0 24 24" width="16">
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
                        <svg fill="none" height="16" viewBox="0 0 24 24" width="16">
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
                </Field>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Work Information"
              icon={<BriefcaseBusiness size={14} />}
              open={openSections.work}
              hasError={sectionErrorMap.work}
              showStatus={submitCount > 0}
              onToggle={() => toggleSection('work')}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field error={errors.userRole?.message} label="User Role" required>
                  <SelectInput
                    className={inputClass(errors.userRole?.message)}
                    {...register('userRole')}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                  </SelectInput>
                </Field>

                <Field error={errors.designation?.message} label="Designation" required>
                  <TextInput
                    className={inputClass(errors.designation?.message)}
                    placeholder="Enter designation"
                    {...register('designation')}
                  />
                </Field>

                <Field error={errors.dateOfJoining?.message} label="Date of Joining" required>
                  <TextInput
                    className={inputClass(errors.dateOfJoining?.message)}
                    type="date"
                    {...register('dateOfJoining')}
                  />
                </Field>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Emergency Contact"
              icon={<Phone size={14} />}
              open={openSections.emergency}
              hasError={sectionErrorMap.emergency}
              showStatus={submitCount > 0}
              onToggle={() => toggleSection('emergency')}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  error={errors.emergencyContactName?.message}
                  label="Emergency Contact Name"
                  required
                >
                  <TextInput
                    className={inputClass(errors.emergencyContactName?.message)}
                    placeholder="Enter contact name"
                    {...register('emergencyContactName')}
                  />
                </Field>

                <Field
                  error={errors.emergencyContactNumber?.message}
                  label="Emergency Contact Number"
                  required
                >
                  <div
                    className={`flex h-[42px] w-full overflow-hidden rounded-xl border bg-[var(--app-surface)] transition focus-within:ring-2 ${
                      errors.emergencyContactNumber?.message
                        ? 'border-[var(--app-error)] focus-within:border-[var(--app-error)] focus-within:ring-[color:rgba(239,68,68,0.15)]'
                        : 'border-[var(--app-border)] focus-within:border-[var(--app-primary)] focus-within:ring-[color:rgba(98,70,234,0.14)]'
                    }`}
                  >
                    <span className="pointer-events-none flex w-[72px] shrink-0 items-center justify-center border-r border-[var(--app-border)] bg-[var(--color-surface-soft)] text-[13px] font-semibold text-[var(--app-text-muted)]">
                      +91
                    </span>
                    <input
                      className="h-full w-full border-0 bg-[var(--app-surface)] px-3 text-[14px] text-[var(--color-ink)] outline-none placeholder:text-[var(--app-text-muted)]"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Enter contact number"
                      {...register('emergencyContactNumber', {
                        onChange: (event) => {
                          event.target.value = normalizeTenDigitPhoneInput(event.target.value);
                        },
                      })}
                    />
                  </div>
                </Field>
              </div>
            </AccordionSection>

            <div className="mt-1 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2.5 text-sm text-[var(--app-text-muted)]">
              By creating an account, you agree to our{' '}
              <span className="font-semibold text-[var(--app-primary)]">Terms</span> and{' '}
              <span className="font-semibold text-[var(--app-primary)]">Privacy Policy</span>.
            </div>

            <section className="rounded-xl border border-[var(--app-border)] bg-gradient-to-r from-[var(--app-surface)] to-[var(--app-surface-2)] px-3.5 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--app-text-muted)]">
                Quick Tips
              </p>
              <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                Keep details accurate for a smoother setup. Most profile fields can be updated later
                from your account settings.
              </p>

              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)]/70 px-2.5 py-2 text-[11px] font-medium text-[var(--app-text-muted)]">
                  Use active contact details for verification updates.
                </div>
                <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)]/70 px-2.5 py-2 text-[11px] font-medium text-[var(--app-text-muted)]">
                  Double-check dates before submitting the form.
                </div>
                <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)]/70 px-2.5 py-2 text-[11px] font-medium text-[var(--app-text-muted)]">
                  Review each section status before creating account.
                </div>
              </div>
            </section>

            <div className="mt-auto flex justify-end gap-3 pt-2">
              <button
                className="h-10 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-7 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface-2)]"
                onClick={handleClearForm}
                type="button"
              >
                Cancel
              </button>
              <SubmitButton
                className="h-10 rounded-xl bg-[var(--app-primary)] px-8 text-sm text-[var(--app-white)] hover:bg-[var(--app-electric-blue-3)]"
                idleLabel="Create Account"
                loading={registerLoading}
                loadingLabel="Creating..."
              />
            </div>
          </div>
        </div>
      </form>
    </AuthShell>
  );
}
