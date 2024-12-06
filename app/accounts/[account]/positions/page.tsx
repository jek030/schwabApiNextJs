import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';
import { Suspense } from 'react';
import EmptyDataTableSkeleton from '../../../components/empty-table-skeleton';
import { columns } from '@/app/lib/positionsTableColumns';
import { DataTable } from '@/app/ui/table';
import { getAccountByNumber } from '@/app/lib/stores/accountStore';
import PageHeader from '@/app/components/PageHeader';
import { Position } from '@/app/lib/utils';
import Calendar from '@/app/components/Calendar';
import { tokenService } from '@/app/api/schwab/tokens/schwabTokenService';
import { headers } from 'next/headers';

export default async function Page({ params }: { params: { account: string } }) {
  const account = await getAccountByNumber(params.account);
  if (!account) {
    throw new Error(`Account ${params.account} not found`);
  }

  const accountNum = params.account;

  /**  Get the hash value for the account */
  let hashValue: string | null = null;
  try {
    // Get the host from headers
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    // Construct the full URL with accountNum parameter
    const url = `${protocol}://${host}/api/schwab/hashedAcc?accountNumber=${accountNum}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch hashed accounts. Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("\nHash value for account:", data.hashValue);
    hashValue = data.hashValue;
    
  } catch (error) {
    console.error('Error fetching hashed accounts:', error);
  } 

  /** Get the transactions for the account using the hash value */
  try {
    if (!hashValue) {
      throw new Error('No hash value available for transactions fetch');
    }

    const headersList = headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    // Set date range for last 7 days
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const transactionUrl = `${protocol}://${host}/api/schwab/transactions?` + new URLSearchParams({
      hashedAccount: hashValue,
      startDate: startDate,
      endDate: endDate,
      types: 'TRADE'
    });

    const response = await fetch(transactionUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions. Status: ${response.status}`);
    }
    const transactionData = await response.json();
    console.log("\nTransactions:", JSON.stringify(transactionData, null, 2));

  } catch (error) {
    console.error('Error fetching transactions:', error);
  }

  // Calculate total day's profit/loss
  const totalDayProfitLoss = account.positions.reduce((sum: number, position: Position) => 
    sum + (position.dayProfitLoss || 0), 0
  );

  const positionEvents = [{
    date: new Date().toISOString().split('T')[0],
    title: `Day P/L: $${totalDayProfitLoss.toFixed(2)}`,
    category: totalDayProfitLoss >= 0 ? 'profit' : 'loss'
  }];

  return (
    <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <PageHeader>
        This is the positions page.
      </PageHeader>
      <main className="flex flex-col gap-8 sm:items-start">
        <p>
          <Link
            href=".."
            className="border border-slate-200 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
          >
            Go Back
          </Link>
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Account {accountNum}</CardTitle>
            <CardDescription>
              View positions for account {accountNum} retrieved from the Charles Schwab API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<EmptyDataTableSkeleton columns={columns} />}>
              <DataTable columns={columns} data={account.positions} />
            </Suspense>
          </CardContent>
        </Card>
        <div className="w-full mt-8">
          <Calendar events={positionEvents} />
        </div>
      </main>
    </div>
  );
}