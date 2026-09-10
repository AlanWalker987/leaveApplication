'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ConfirmActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  pendingLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
};

export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = 'Ok',
  cancelLabel = 'Cancel',
  isConfirming = false,
  pendingLabel = 'Processing...',
  variant = 'danger',
}: ConfirmActionDialogProps) {
  const actionButtonClassName =
    variant === 'warning'
      ? 'min-w-28 bg-[var(--app-warning)] text-[var(--app-white)] hover:bg-[var(--app-gold-3)]'
      : variant === 'default'
        ? 'min-w-28 bg-[var(--app-black)] text-[var(--app-white)] hover:bg-[var(--app-gray-700)]'
        : 'min-w-28 bg-[var(--app-error)] text-[var(--app-white)] hover:bg-[var(--app-vibrant-orange-3)]';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-xl border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-[var(--app-text)]">
        <AlertDialogHeader className="space-y-3 text-center">
          <AlertDialogTitle className="text-2xl font-bold text-[var(--app-text)]">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-base leading-relaxed text-[var(--app-text)]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex-row justify-center gap-3 sm:space-x-0">
          <AlertDialogCancel
            disabled={isConfirming}
            className="mt-0 min-w-28 border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:bg-[var(--app-surface-2)]"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isConfirming}
            className={actionButtonClassName}
          >
            {isConfirming ? pendingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
