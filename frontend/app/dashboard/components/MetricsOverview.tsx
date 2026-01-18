import { Package, TrendingUp, DollarSign } from 'lucide-react';

export function MetricsOverview() {
  const metrics = [
    {
      label: 'Active Products',
      value: '6',
      icon: Package,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-[#5f8e3e]',
    },
    {
      label: 'Avg Price Change',
      value: '+3.2%',
      icon: TrendingUp,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-400',
    },
    {
      label: 'Revenue Impact',
      value: '$12,450',
      icon: DollarSign,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 relative"
          >
            <div className={`absolute top-6 right-6 w-12 h-12 rounded-lg ${metric.iconBg} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${metric.iconColor}`} />
            </div>
            <div className="pr-16">
              <p className="text-sm text-slate-500 mb-1">{metric.label}</p>
              <p className="text-slate-900 text-2xl font-bold">{metric.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}