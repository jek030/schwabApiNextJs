import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/ui/card';
import { Suspense } from 'react';
import EmptyDataTableSkeleton from './empty-table-skeleton';
import { columns } from '@/app/lib/positionsTableColumns';
import TransactionsTable from './TransactionsTable';
import { ProcessedTransaction } from '@/app/lib/utils';

interface TransactionsCardProps {
  transactions: ProcessedTransaction[];
  accountNum: string;
  onDaysChange: (days: number) => void;
  fetchTransactions: (days: number) => Promise<void>;
}

export default function TransactionsCard({ 
  transactions, 
  accountNum, 
  onDaysChange,
  fetchTransactions 
}: TransactionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          View recent transactions for this account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<EmptyDataTableSkeleton columns={columns} />}>
          <TransactionsTable 
            transactions={transactions} 
            accountNum={accountNum}
            onDaysChange={onDaysChange}
            fetchTransactions={fetchTransactions}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
} 