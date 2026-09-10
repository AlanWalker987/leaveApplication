'use client';

import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';
import { useCurrentUser } from '@/app/hooks';
import {
  CREATE_LEAVE,
  GET_MY_LEAVES,
  GET_PUBLIC_HOLIDAYS,
} from '@/app/graphql/employee/employeeOperations';
import { ErrorPopup, WarningPopup } from '@/components/dialogs/message-popup';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  formatDateValue,
  getDatesInRange,
  isDateAfter,
  isWeekendDate,
  parseIsoDate,
  toIsoDateInput,
  toIsoStartOfDay,
  toYearMonthKey,
} from '@/lib/datetimeutile';

type LeaveTypeCard = {
  id: string;
  name: string;
  code: string;
  annualAllowance: number;
  balance: number;
  accentClass: string;
};

type CreateLeaveMutationData = {
  createLeave: {
    id: string;
    leaveTypeDescription: string;
    fromDate: string;
    toDate: string;
    totalDays: number;
  };
};

type CreateLeaveMutationVariables = {
  input: {
    leaveTypeCode: string;
    reason: string;
    fromDate: string;
    toDate: string;
  };
};

type SubmittedLeave = {
  id: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  workingDays: number;
};

type HolidayQueryData = {
  getPublicHolidays: {
    results: Array<{
      id: string;
      holidayDate: string;
      isDeleted: boolean;
    }>;
  };
};

type MyLeavesQueryData = {
  getMyLeaves: {
    results: Array<{
      leaveTypeCode: string;
      status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
      totalDays: number;
      fromDate: string;
    }>;
  };
};

const LEAVE_TYPES: Omit<LeaveTypeCard, 'balance'>[] = [
  {
    id: 'earned',
    name: 'Earned Leave',
    code: 'EL',
    annualAllowance: 20,
    accentClass: 'bg-[var(--app-primary)]',
  },
];

const FEMALE_ONLY_LEAVE: Omit<LeaveTypeCard, 'balance'> = {
  id: 'additional',
  name: 'Additional Leave',
  code: 'AH',
  annualAllowance: 12,
  accentClass: 'bg-[var(--app-success)]',
};

const MAX_CONTINUOUS_WORKING_DAYS = 3;

function toDateKey(value: string): string {
  return toIsoDateInput(value, '');
}

function countWorkingDays(
  fromDate: string,
  toDate: string,
  holidays: Set<string>,
): {
  workingDays: number;
  weekendExcluded: number;
  holidaysExcluded: number;
  bothExcluded: number;
  totalExcluded: number;
} {
  if (!fromDate || !toDate) {
    return {
      workingDays: 0,
      weekendExcluded: 0,
      holidaysExcluded: 0,
      bothExcluded: 0,
      totalExcluded: 0,
    };
  }

  const start = parseIsoDate(fromDate);
  const end = parseIsoDate(toDate);

  if (!start || !end || isDateAfter(start, end)) {
    return {
      workingDays: 0,
      weekendExcluded: 0,
      holidaysExcluded: 0,
      bothExcluded: 0,
      totalExcluded: 0,
    };
  }

  let workingDays = 0;
  let weekendExcluded = 0;
  let holidaysExcluded = 0;
  let bothExcluded = 0;

  for (const currentDay of getDatesInRange(start, end)) {
    const key = formatDateValue(currentDay, 'yyyy-MM-dd');
    const weekend = isWeekendDate(currentDay);
    const holiday = holidays.has(key);

    if (!weekend && !holiday) {
      workingDays += 1;
    } else {
      if (weekend) {
        weekendExcluded += 1;
      }

      if (holiday && !weekend) {
        holidaysExcluded += 1;
      }

      if (holiday && weekend) {
        bothExcluded += 1;
      }
    }
  }

  return {
    workingDays,
    weekendExcluded,
    holidaysExcluded,
    bothExcluded,
    totalExcluded: weekendExcluded + holidaysExcluded,
  };
}

function StepPill({
  number,
  label,
  active,
  completed,
  showConnector,
  connectorActive,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
  showConnector: boolean;
  connectorActive: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
            completed || active
              ? 'border-[var(--app-primary)] bg-[var(--app-primary)] text-[var(--app-white)]'
              : 'border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)]'
          }`}
        >
          {completed ? '✓' : number}
        </span>
        <span
          className={`whitespace-nowrap text-xs ${active ? 'font-semibold text-[var(--app-text)]' : 'text-[var(--app-text-muted)]'}`}
        >
          {label}
        </span>
      </div>
      {showConnector ? (
        <span
          className={`hidden h-px w-16 md:inline-block ${connectorActive ? 'bg-[var(--app-primary)]' : 'bg-[var(--app-surface-2)]'}`}
        />
      ) : null}
    </div>
  );
}

function getMutationErrorMessage(error: unknown): string {
  if (error instanceof ApolloError) {
    const gqlMessage = error.graphQLErrors[0]?.message;
    if (gqlMessage) {
      return gqlMessage;
    }
  }

  return error instanceof Error ? error.message : 'Unable to submit leave request.';
}

function getMonthKey(dateText: string): string | null {
  return dateText ? toYearMonthKey(dateText) : null;
}

function toDateFromIso(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  return parseIsoDate(value) ?? undefined;
}

export default function EmployeeApplyLeavePage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { data } = useQuery<HolidayQueryData>(GET_PUBLIC_HOLIDAYS, {
    variables: { offset: 0, limit: 200 },
    fetchPolicy: 'cache-first',
  });
  const { data: myLeavesData } = useQuery<MyLeavesQueryData>(GET_MY_LEAVES, {
    variables: { offset: 0, limit: 500 },
    fetchPolicy: 'cache-and-network',
  });

  const [step, setStep] = useState(1);
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState<string>('earned');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState<SubmittedLeave | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fromPickerOpen, setFromPickerOpen] = useState(false);
  const [toPickerOpen, setToPickerOpen] = useState(false);
  const [popupState, setPopupState] = useState<{
    open: boolean;
    message: string;
    tone: 'error' | 'warning';
  }>({
    open: false,
    message: '',
    tone: 'warning',
  });
  const lastAhConsumedPopupMonth = useRef<string | null>(null);
  const [createLeave, { loading: creatingLeave }] = useMutation<
    CreateLeaveMutationData,
    CreateLeaveMutationVariables
  >(CREATE_LEAVE);

  const isFemale = user?.gender === 'Female';

  const leaveTypes = useMemo(() => {
    const availableLeaveTypes = isFemale ? [...LEAVE_TYPES, FEMALE_ONLY_LEAVE] : LEAVE_TYPES;
    const approvedLeaves = (myLeavesData?.getMyLeaves.results ?? []).filter(
      (leave) => leave.status === 'Approved',
    );

    const approvedDaysByCode = approvedLeaves.reduce<Record<string, number>>((acc, leave) => {
      const code = leave.leaveTypeCode?.trim().toUpperCase();
      if (!code) {
        return acc;
      }

      acc[code] = (acc[code] ?? 0) + Number(leave.totalDays ?? 0);
      return acc;
    }, {});

    return availableLeaveTypes.map((leaveType) => {
      const used = approvedDaysByCode[leaveType.code] ?? 0;
      const balance = Math.max(leaveType.annualAllowance - used, 0);

      return {
        ...leaveType,
        balance,
      };
    });
  }, [isFemale, myLeavesData]);

  useEffect(() => {
    if (!leaveTypes.some((leaveType) => leaveType.id === selectedLeaveTypeId)) {
      setSelectedLeaveTypeId('earned');
    }
  }, [leaveTypes, selectedLeaveTypeId]);

  const holidaySet = useMemo(() => {
    const holidays = data?.getPublicHolidays.results ?? [];
    return new Set(
      holidays
        .filter((holiday) => !holiday.isDeleted)
        .map((holiday) => toDateKey(holiday.holidayDate)),
    );
  }, [data]);

  const selectedLeaveType =
    leaveTypes.find((leaveType) => leaveType.id === selectedLeaveTypeId) ?? leaveTypes[0];
  const availableBalance = selectedLeaveType.balance;

  const summary = useMemo(
    () => countWorkingDays(fromDate, toDate, holidaySet),
    [fromDate, toDate, holidaySet],
  );

  const remainingAfter = availableBalance - summary.workingDays;
  const exceedsLimit = summary.workingDays > MAX_CONTINUOUS_WORKING_DAYS;
  const exceedsAdditionalLeaveDateLimit =
    selectedLeaveType.code === 'AH' && Boolean(fromDate) && Boolean(toDate) && fromDate !== toDate;
  const selectedMonthKey = getMonthKey(fromDate || toDate);
  const ahAlreadyConsumedForSelectedMonth = useMemo(() => {
    if (selectedLeaveType.code !== 'AH' || !selectedMonthKey) {
      return false;
    }

    const existingLeaves = myLeavesData?.getMyLeaves.results ?? [];
    return existingLeaves.some((leave) => {
      if (leave.leaveTypeCode !== 'AH') {
        return false;
      }

      if (leave.status !== 'Pending' && leave.status !== 'Approved') {
        return false;
      }

      const monthKey = getMonthKey(leave.fromDate);
      return monthKey === selectedMonthKey;
    });
  }, [myLeavesData, selectedLeaveType.code, selectedMonthKey]);

  const canContinueDates =
    Boolean(fromDate) &&
    Boolean(toDate) &&
    summary.workingDays > 0 &&
    !ahAlreadyConsumedForSelectedMonth &&
    !exceedsAdditionalLeaveDateLimit &&
    !exceedsLimit &&
    remainingAfter >= 0;

  function isNonWorkingDay(date: Date): boolean {
    return isWeekendDate(date) || holidaySet.has(formatDateValue(date, 'yyyy-MM-dd'));
  }

  function onFromDateSelect(date?: Date) {
    if (!date) {
      setFromDate('');
      return;
    }

    const nextFromDate = formatDateValue(date, 'yyyy-MM-dd');
    setFromDate(nextFromDate);
    setFromPickerOpen(false);

    if (!toDate) {
      return;
    }

    const selectedToDate = parseIsoDate(toDate);
    if (selectedToDate && isDateAfter(date, selectedToDate)) {
      setToDate(nextFromDate);
    }
  }

  function onToDateSelect(date?: Date) {
    if (!date) {
      setToDate('');
      return;
    }

    const nextToDate = formatDateValue(date, 'yyyy-MM-dd');
    setToDate(nextToDate);
    setToPickerOpen(false);

    if (!fromDate) {
      return;
    }

    const selectedFromDate = parseIsoDate(fromDate);
    if (selectedFromDate && isDateAfter(selectedFromDate, date)) {
      setFromDate(nextToDate);
    }
  }

  useEffect(() => {
    if (
      selectedLeaveType.code === 'AH' &&
      selectedMonthKey &&
      ahAlreadyConsumedForSelectedMonth &&
      lastAhConsumedPopupMonth.current !== selectedMonthKey
    ) {
      setPopupState({
        open: true,
        message: 'AH already cosumned for the month.',
        tone: 'warning',
      });
      lastAhConsumedPopupMonth.current = selectedMonthKey;
    }

    if (!ahAlreadyConsumedForSelectedMonth) {
      lastAhConsumedPopupMonth.current = null;
    }
  }, [ahAlreadyConsumedForSelectedMonth, selectedLeaveType.code, selectedMonthKey]);

  function resetForm() {
    setStep(1);
    setSelectedLeaveTypeId('earned');
    setFromDate('');
    setToDate('');
    setReason('');
    setSubmitted(null);
    setSubmitError(null);
    setPopupState((prev) => ({ ...prev, open: false }));
  }

  async function submitRequest() {
    setSubmitError(null);

    const fromDateIso = toIsoStartOfDay(fromDate);
    const toDateIso = toIsoStartOfDay(toDate);

    if (!fromDateIso || !toDateIso) {
      setSubmitError('Please select valid dates before submitting.');
      return;
    }

    try {
      const result = await createLeave({
        variables: {
          input: {
            leaveTypeCode: selectedLeaveType.code,
            reason: reason.trim(),
            fromDate: fromDateIso,
            toDate: toDateIso,
          },
        },
      });

      const created = result.data?.createLeave;
      if (!created) {
        setSubmitError('Unable to submit leave request.');
        return;
      }

      setSubmitted({
        id: created.id,
        leaveType: created.leaveTypeDescription,
        fromDate: toDateKey(created.fromDate),
        toDate: toDateKey(created.toDate),
        workingDays: Number(created.totalDays),
      });
    } catch (error) {
      setSubmitError(getMutationErrorMessage(error));
    }
  }

  if (submitted) {
    return (
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--app-success)_16%,var(--app-bg))] text-2xl text-[var(--app-success)]">
          ✓
        </div>
        <h1 className="mt-5 text-center text-2xl font-semibold text-[var(--app-text)]">
          Request Submitted!
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--app-text)]">
          Your leave request has been sent to your reporting manager for approval.
        </p>

        <p className="mt-2 text-center text-sm text-[var(--app-text-muted)]">Request ID: {submitted.id}</p>

        <div className="mt-6 rounded-2xl bg-[var(--app-surface-2)] p-5">
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-[var(--app-text-muted)]">Type</dt>
              <dd className="font-semibold text-[var(--app-text)]">{submitted.leaveType}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--app-text-muted)]">Duration</dt>
              <dd className="font-semibold text-[var(--app-text)]">
                {submitted.fromDate}
                {' - '}
                {submitted.toDate}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--app-text-muted)]">Working Days</dt>
              <dd className="font-semibold text-[var(--app-text)]">{submitted.workingDays} days</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            className="rounded-xl border border-[var(--app-border)] px-5 py-3 text-sm font-semibold text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
            onClick={resetForm}
            type="button"
          >
            New Request
          </button>
          <button
            className="rounded-xl bg-[var(--app-primary)] px-5 py-3 text-sm font-semibold text-[var(--app-white)] hover:bg-[var(--app-electric-blue-3)]"
            onClick={() => router.push('/employee/leave-status')}
            type="button"
          >
            View Status
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {popupState.tone === 'warning' ? (
        <WarningPopup
          open={popupState.open}
          message={popupState.message}
          onClose={() => setPopupState((prev) => ({ ...prev, open: false }))}
        />
      ) : (
        <ErrorPopup
          open={popupState.open}
          message={popupState.message}
          onClose={() => setPopupState((prev) => ({ ...prev, open: false }))}
        />
      )}

      <div className="rounded-2xl bg-[var(--app-surface)] p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[var(--app-text)]">Apply for Leave</h1>
        <p className="mt-1 text-sm text-[var(--app-text)]">
          Submit a new leave request, takes less than 2 minutes
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 md:gap-4">
          <StepPill
            number={1}
            label="Leave Type"
            active={step === 1}
            completed={step > 1}
            showConnector
            connectorActive={step > 1}
          />
          <StepPill
            number={2}
            label="Dates"
            active={step === 2}
            completed={step > 2}
            showConnector
            connectorActive={step > 2}
          />
          <StepPill
            number={3}
            label="Reason"
            active={step === 3}
            completed={step > 3}
            showConnector
            connectorActive={step > 3}
          />
          <StepPill
            number={4}
            label="Review & Submit"
            active={step === 4}
            completed={false}
            showConnector={false}
            connectorActive={false}
          />
        </div>
      </div>

      <section className="mt-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
        {step === 1 ? (
          <>
            <h2 className="text-xl font-semibold text-[var(--app-text)]">Select Leave Type</h2>
            <p className="mt-1 text-sm text-[var(--app-text)]">
              Choose the type of leave you want to apply for
            </p>

            {isFemale ? (
              <div className="mt-4 rounded-xl border border-[color:color-mix(in_srgb,var(--app-success)_35%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-success)_16%,var(--app-bg))] px-4 py-3 text-sm text-[var(--app-success)]">
                Additional Leave (AH): 12 per year, maximum 1 AH per month.
              </div>
            ) : null}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {leaveTypes.map((leaveType) => {
                const active = selectedLeaveTypeId === leaveType.id;
                const effectiveBalance = leaveType.balance;
                return (
                  <button
                    key={leaveType.id}
                    className={`rounded-xl border p-4 text-left transition ${
                      active
                        ? 'border-[var(--app-primary)] bg-[var(--app-electric-blue-1)] shadow-[0_0_0_2px_rgba(43,74,191,0.08)]'
                        : 'border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-border)]'
                    }`}
                    onClick={() => setSelectedLeaveTypeId(leaveType.id)}
                    type="button"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-semibold text-[var(--app-text)]">{leaveType.name}</p>
                        <p className="text-sm font-semibold tracking-wide text-[var(--app-text-muted)]">
                          {leaveType.code}
                        </p>
                      </div>
                      {active ? (
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--app-primary)] text-sm font-bold text-[var(--app-white)]">
                          ✓
                        </span>
                      ) : null}
                    </div>

                    <Progress
                      className="mt-4"
                      value={effectiveBalance}
                      max={leaveType.annualAllowance}
                      indicatorClassName={leaveType.accentClass}
                    />

                    <p className="mt-2 text-sm font-medium text-[var(--app-text)]">
                      {effectiveBalance} left
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end border-t border-[var(--app-border)] pt-5">
              <button
                className="rounded-xl bg-[var(--app-primary)] px-6 py-3 text-sm font-semibold text-[var(--app-white)] hover:bg-[var(--app-electric-blue-3)]"
                onClick={() => setStep(2)}
                type="button"
              >
                Continue
              </button>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            {ahAlreadyConsumedForSelectedMonth ? (
              <div className="mb-5 rounded-xl border border-[color:color-mix(in_srgb,var(--app-error)_30%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] px-4 py-3 text-sm text-[var(--app-error)]">
                AH already cosumned for the month.
              </div>
            ) : null}

            {exceedsAdditionalLeaveDateLimit ? (
              <div className="mb-5 rounded-xl border border-[color:color-mix(in_srgb,var(--app-error)_30%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] px-4 py-3 text-sm text-[var(--app-error)]">
                Only 1 day per month can be selected while applying for AH.
              </div>
            ) : null}

            {exceedsLimit ? (
              <div className="mb-5 rounded-xl border border-[color:color-mix(in_srgb,var(--app-error)_30%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-error)_10%,var(--app-bg))] px-4 py-3 text-sm text-[var(--app-error)]">
                Maximum 3 continuous working days allowed per application. Please split into
                multiple requests.
              </div>
            ) : null}

            <h2 className="text-xl font-semibold text-[var(--app-text)]">Select Dates</h2>
            <p className="mt-1 text-sm text-[var(--app-text)]">
              Weekends and public holidays are automatically excluded
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text)]">
                  From
                </span>
                <div className="flex h-12 items-center justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 text-sm text-[var(--app-text)]">
                  <span className={fromDate ? 'text-[var(--app-text)]' : 'text-[var(--app-text-muted)]'}>
                    {fromDate ? formatDateValue(fromDate, 'dd-MM-yyyy') : 'dd-mm-yyyy'}
                  </span>
                  <Popover open={fromPickerOpen} onOpenChange={setFromPickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--app-text)] transition hover:bg-[var(--app-surface-2)]"
                        aria-label="Select from date"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={toDateFromIso(fromDate)}
                        onSelect={onFromDateSelect}
                        className="rounded-xl"
                        disabled={(date) => {
                          const selectedToDate = parseIsoDate(toDate);
                          return (
                            isNonWorkingDay(date) ||
                            (selectedToDate ? isDateAfter(date, selectedToDate) : false)
                          );
                        }}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text)]">
                  To
                </span>
                <div className="flex h-12 items-center justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 text-sm text-[var(--app-text)]">
                  <span className={toDate ? 'text-[var(--app-text)]' : 'text-[var(--app-text-muted)]'}>
                    {toDate ? formatDateValue(toDate, 'dd-MM-yyyy') : 'dd-mm-yyyy'}
                  </span>
                  <Popover open={toPickerOpen} onOpenChange={setToPickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--app-text)] transition hover:bg-[var(--app-surface-2)]"
                        aria-label="Select to date"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={toDateFromIso(toDate)}
                        onSelect={onToDateSelect}
                        className="rounded-xl"
                        disabled={(date) => {
                          const selectedFromDate = parseIsoDate(fromDate);
                          return (
                            isNonWorkingDay(date) ||
                            (selectedFromDate ? isDateAfter(selectedFromDate, date) : false)
                          );
                        }}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </label>
            </div>

            <div className="mt-5 rounded-xl border border-[var(--app-border)]">
              <div className="border-b border-[var(--app-border)] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                Leave Summary
              </div>
              <div className="grid gap-4 px-4 py-5 sm:grid-cols-2">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-[var(--app-text)]">{summary.workingDays}</p>
                  <p className="text-xs text-[var(--app-text-muted)]">Working Days</p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-2xl font-semibold ${remainingAfter >= 0 ? 'text-[var(--app-success)]' : 'text-[var(--app-error)]'}`}
                  >
                    {remainingAfter}
                  </p>
                  <p className="text-xs text-[var(--app-text-muted)]">Remaining After</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[color:color-mix(in_srgb,var(--app-warning)_35%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-warning)_20%,var(--app-bg))] px-4 py-3 text-sm text-[var(--app-warning)]">
              Maximum 3 continuous working days per application. Apply separately for longer
              durations.
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[var(--app-border)] pt-5">
              <button
                className="rounded-xl border border-[var(--app-border)] px-5 py-2.5 text-sm font-medium text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
                onClick={() => setStep(1)}
                type="button"
              >
                Back
              </button>
              <button
                className="rounded-xl bg-[var(--app-primary)] px-6 py-3 text-sm font-semibold text-[var(--app-white)] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setStep(3)}
                type="button"
                disabled={!canContinueDates}
              >
                Continue
              </button>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 className="text-xl font-semibold text-[var(--app-text)]">Reason for Leave</h2>
            <p className="mt-1 text-sm text-[var(--app-text)]">
              This will be visible to your reporting manager
            </p>

            <textarea
              className="mt-5 h-44 w-full resize-none rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--app-primary)]"
              placeholder="Share a brief reason"
              value={reason}
              maxLength={500}
              onChange={(event) => setReason(event.target.value)}
            />
            <p className="mt-2 text-right text-xs text-[var(--app-text-muted)]">{reason.length} / 500</p>

            <div className="mt-8 flex items-center justify-between border-t border-[var(--app-border)] pt-5">
              <button
                className="rounded-xl border border-[var(--app-border)] px-5 py-2.5 text-sm font-medium text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
                onClick={() => setStep(2)}
                type="button"
              >
                Back
              </button>
              <button
                className="rounded-xl bg-[var(--app-primary)] px-6 py-3 text-sm font-semibold text-[var(--app-white)] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setStep(4)}
                type="button"
                disabled={reason.trim().length < 3}
              >
                Continue
              </button>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h2 className="text-xl font-semibold text-[var(--app-text)]">Review Your Request</h2>
            <p className="mt-1 text-sm text-[var(--app-text)]">Confirm the details before submitting</p>

            <div className="mt-5 overflow-hidden rounded-xl border border-[var(--app-border)]">
              {[
                ['Leave Type', selectedLeaveType.name],
                ['From Date', fromDate],
                ['To Date', toDate],
                ['Total Leave Days', `${summary.workingDays} working days`],
                ['Reporting Manager', 'Sarah Chen'],
                ['Remaining Balance After', `${remainingAfter} days`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-1 border-b border-[var(--app-border)] px-4 py-3 sm:grid-cols-[1fr_auto]"
                >
                  <span className="text-sm text-[var(--app-text)]">{label}</span>
                  <span className="text-sm font-semibold text-[var(--app-text)]">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-[var(--app-surface-2)] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">Reason</p>
              <p className="mt-2 text-sm text-[var(--app-text)]">{reason}</p>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[var(--app-border)] pt-5">
              <button
                className="rounded-xl border border-[var(--app-border)] px-5 py-2.5 text-sm font-medium text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
                onClick={() => setStep(3)}
                type="button"
              >
                Back
              </button>
              <button
                className="rounded-xl bg-[var(--app-success)] px-6 py-3 text-sm font-semibold text-[var(--app-white)] hover:bg-[var(--app-primary)]"
                onClick={submitRequest}
                type="button"
                disabled={creatingLeave}
              >
                {creatingLeave ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>

            {submitError ? (
              <p className="mt-4 text-sm font-medium text-[var(--app-error)]">{submitError}</p>
            ) : null}
          </>
        ) : null}
      </section>
    </>
  );
}
