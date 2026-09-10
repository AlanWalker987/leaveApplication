import { Spinner } from '@/components/ui/spinner';

export function Loader() {
  return (
    <div className="flex flex-col items-center gap-3 text-[var(--app-text)]">
      <Spinner className="size-10" />
      <p className="text-lg font-semibold tracking-wide">Loading...</p>
    </div>
  );
}
