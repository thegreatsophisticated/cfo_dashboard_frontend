import { Users, UserCheck, UserX, Clock, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyStats as StatsType } from '@/types/company';

interface CompanyStatsProps {
  stats: StatsType;
}

export const CompanyStats = ({ stats }: CompanyStatsProps) => {
  const statItems = [
    {
      label: 'Total Workers',
      value: stats.totalWorkers,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Available',
      value: stats.availableWorkers,
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Assigned',
      value: stats.assignedWorkers,
      icon: UserX,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Pending Requests',
      value: stats.pendingRequests,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Monthly Revenue',
      value: `${(stats.monthlyRevenue / 1000).toFixed(0)}K RWF`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Revenue',
      value: `${(stats.totalRevenue / 1000000).toFixed(2)}M RWF`,
      icon: Wallet,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {statItems.map((item) => (
        <Card key={item.label} className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${item.bgColor}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
