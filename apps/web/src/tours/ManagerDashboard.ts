import type { AppTour } from 'company-user-tour';
export const ManagerDashboardTour: AppTour = {
  id: 'dashboard',
  steps: [
    { target: 'dashboard', title: 'Dashboard', description: 'This is your application dashboard.' },
    { target: 'profile', title: 'Profile', description: 'You can manage your profile here.' },
    {
      target: 'settings',
      title: 'Settings',
      description: 'Application settings are available here.',
    },
  ],
};
