import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';

interface PageHeaderProps {
  children: ReactNode;
}

export default function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className="flex flex-col w-3/4 mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome to Finance Guy</CardTitle>
          <CardDescription className="text-gray-800 md:text-xl md:leading-normal text-center">
            {children}
          </CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </header>
  );
} 