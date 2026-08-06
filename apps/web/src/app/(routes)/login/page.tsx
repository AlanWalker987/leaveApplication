import { Suspense } from 'react';
import { LoginPageFeature } from '../../features/auth';

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="p-6">Loading login...</main>}>
      <LoginPageFeature />
    </Suspense>
  );
}
