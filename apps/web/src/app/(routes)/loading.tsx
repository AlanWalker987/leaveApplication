import { Loader } from '@/components/loader/Loader';

export default function Loading() {
  return (
    <main className="flex h-full min-h-[60vh] w-full items-center justify-center bg-[var(--app-surface)] px-4">
      <Loader />
    </main>
  );
}
