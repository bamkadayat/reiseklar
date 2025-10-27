import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
  blue: 'bg-primary/10 text-primary',
  green: 'bg-primary/10 text-primary',
  purple: 'bg-primary/10 text-primary',
  orange: 'bg-primary/10 text-primary',
  red: 'bg-destructive/10 text-destructive',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = 'blue',
}: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-primary' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              {description && (
                <span className="text-sm text-muted-foreground">{description}</span>
              )}
            </div>
          )}
          {!trend && description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
