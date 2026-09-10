import type { AppTour } from 'company-user-tour';
export const AdminDashboardTour: AppTour = {
  id: 'admin-dashboard',
  steps: [
    {
      target: 'admin-sidebar-dashboard',
      title: 'Dashboard Menu',
      description: 'Use this menu item to return to the admin dashboard overview.',
    },
    {
      target: 'admin-sidebar-leaves-availed',
      title: 'Leaves Availed Menu',
      description: 'Open leave utilization details across employees and periods.',
    },
    {
      target: 'admin-sidebar-leave-status',
      title: 'Leave Status Menu',
      description: 'Track leave requests by approval status in one place.',
    },
    {
      target: 'admin-sidebar-admin-console',
      title: 'Admin Console Menu',
      description: 'Manage core master data and admin controls from here.',
    },
    {
      target: 'admin-sidebar-reports',
      title: 'Reports Menu',
      description: 'View analytic reports and exports for operations.',
    },
    {
      target: 'admin-dashboard-overview',
      title: 'Admin Dashboard Overview',
      description: 'Use this area to review overall organisation health and launch the tour.',
    },
    {
      target: 'admin-dashboard-stats',
      title: 'Workforce Snapshot',
      description: 'These cards summarize employees, managers, departments, and branches.',
    },
    {
      target: 'admin-dashboard-breakdown',
      title: 'Headcount Breakdowns',
      description: 'These charts help compare headcount across departments, branches, and vendors.',
    },
  ],
};
