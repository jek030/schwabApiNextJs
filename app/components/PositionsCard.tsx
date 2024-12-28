import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/ui/card';
import { DataTable } from '@/app/ui/table';
import { columns } from '@/app/lib/positionsTableColumns';
import EmptyDataTableSkeleton from './empty-table-skeleton';
import { Suspense } from 'react';

interface PositionsCardProps {
  accountNumber: string;
  account: any;
}

export default function PositionsCard({ accountNumber, account }: PositionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account {accountNumber}</CardTitle>
        <CardDescription>
          View positions for account {accountNumber} retrieved from the Charles Schwab API.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<EmptyDataTableSkeleton columns={columns} />}>
          {account ? (
            <DataTable columns={columns} data={account.positions} />
          ) : (
            <EmptyDataTableSkeleton columns={columns} />
          )}
        </Suspense>
      </CardContent>
    </Card>
  );
} 