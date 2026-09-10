'use client';
import { useTour } from 'company-user-tour';

type StartTourButtonProps = {
  tourId?: string;
};

export function StartTourButton({ tourId = 'dashboard' }: StartTourButtonProps) {
  const { startTour } = useTour();
  return <button onClick={() => startTour(tourId)}> Start Tour </button>;
}
