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
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              {description && (
                <span className="text-sm text-gray-500 dark:text-gray-400">{description}</span>
              )}
            </div>
          )}
          {!trend && description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
