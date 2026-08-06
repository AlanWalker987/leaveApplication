'use client';

export function useCurrentTimeGreetingMessage() {
  const hour = new Date().getHours();

  const userGreetingMessage =
    hour >= 5 && hour < 12
      ? 'Good morning'
      : hour >= 12 && hour < 17
        ? 'Good afternoon'
        : hour >= 17 && hour < 21
          ? 'Good evening'
          : 'Good night';

  return { userGreetingMessage };
}
