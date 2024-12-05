import {Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';
import EmptyDataTableSkeleton from '../components/empty-table-skeleton';
import { Suspense } from 'react';
import { columns } from '../lib/accountsTableColumns';
import { getAccounts } from '../lib/stores/accountStore';
import PageHeader from '../components/PageHeader';
import AccountsRefreshButton from '../components/AccountsRefreshButton';
import { DataTable } from '../ui/table';

export default async function Page() {
  const { data: accounts, isCached, expiresAt } = await getAccounts();
      
  return (
    <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <PageHeader>
        This is the accounts page.
      </PageHeader>
    
      <main className="flex flex-col gap-8 sm:items-start">    
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>
                View accounts retrieved form Charles Schwab API.
              </CardDescription>
            </div>
            <AccountsRefreshButton isCached={isCached} expiresAt={expiresAt} />
          </CardHeader>
          <CardContent>
            <Suspense fallback={EmptyDataTableSkeleton(columns)}>
              <DataTable columns={columns} data={accounts}/>
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
