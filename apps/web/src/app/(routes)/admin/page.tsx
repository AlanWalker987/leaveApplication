import AdminEmployeeCard from '@/app/components/AdminEmployeeCard';
import EmployeeBanner from '@/app/components/EmployeeBanner';
import { Layers, MapPin, SquareChartGantt, Users } from 'lucide-react';

export default function AdminPage() {
  const adminStats = [
    {
      icon: <Users className="h-5 w-5" />,
      value: 11,
      title: 'Days Available',
      subtitle: 'Annual leave',
      iconClassName: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <SquareChartGantt className="h-5 w-5" />,
      value: 4,
      title: 'Pending Approval',
      subtitle: 'requests in queue',
      iconClassName: 'bg-amber-50 text-amber-600',
    },
    {
      icon: <Layers className="h-5 w-5" />,
      value: 2,
      title: 'Approved Leaves',
      subtitle: 'this year',
      iconClassName: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      value: 7,
      title: 'Days Used',
      subtitle: 'across all types',
      iconClassName: 'bg-violet-50 text-violet-600',
    },
  ];

  return (
    <div className="space-y-4">
      <EmployeeBanner />
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
          <AdminEmployeeCard
            key={stat.title}
            icon={stat.icon}
            value={stat.value}
            title={stat.title}
            subtitle={stat.subtitle}
            iconClassName={stat.iconClassName}
          />
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Admin dashboard scaffold.
      </div>
    </div>
  );
}
