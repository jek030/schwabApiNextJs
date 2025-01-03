import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';
import { cn } from '@/app/lib/utils';

interface PageHeaderProps {
  title?: string;
  description?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
  loading?: boolean;
}

export default function PageHeader({ 
  title = 'Welcome to Finance Guy',
  description,
  children,
  actions,
  className,
  loading = false,
}: PageHeaderProps) {
  if (loading) {
    return (
      <header className={cn('w-full', className)}>
        <Card className="py-2">
          <CardHeader className="text-center py-2">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </CardHeader>
        </Card>
      </header>
    );
  }

  return (
    <header className={cn('w-full', className)}>
      <Card className="py-2">
        <CardHeader className="text-center py-2 ">
          <div className="flex items-center justify-between">
            <div className="w-full text-center">
              <CardTitle className="text-xl">{title}</CardTitle>
              {actions && <div className="flex gap-2">{actions}</div>}
            </div>
          </div>
          {description && (
            <CardDescription className="text-gray-800 text-sm md:text-base">
              {description}
            </CardDescription>
          )}
          {children && (
            <CardDescription className="text-gray-800 text-sm md:text-base">
              {children}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </header>
  );
} 