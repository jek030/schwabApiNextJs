import {Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';
import EmptyDataTableSkeleton from '../components/empty-table-skeleton';
import { Suspense } from 'react';
import { columns } from '../lib/accountsTableColumns';
import { getAccounts } from '../lib/stores/accountStore';
import PageHeader from '../components/PageHeader';
import AccountsRefreshButton from '../components/AccountsRefreshButton';
import { DataTable } from '../ui/table';

// Separate async component for data fetching
async function AccountsDataTable() {
  const { data: accounts, isCached, expiresAt } = await getAccounts();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>
            View accounts retrieved from Charles Schwab API.
          </CardDescription>
        </div>
        <AccountsRefreshButton isCached={isCached} expiresAt={expiresAt} />
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={accounts}/>
      </CardContent>
    </Card>
  );
}

// Main page component with immediate render and loading state
export default function Page() {
  return (
    <div className="flex flex-col">
      <div className="p-6">
        <PageHeader>
          This is the accounts page.
        </PageHeader>
      </div>
    
      <main className="p-6 flex flex-col gap-8 sm:items-start">    
        <Suspense fallback={
          <Card>
            <CardHeader>
              <CardTitle>Loading Accounts...</CardTitle>
              <CardDescription>
                Retrieving data from Charles Schwab API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyDataTableSkeleton columns={columns} />
            </CardContent>
          </Card>
        }>
          <AccountsDataTable />
        </Suspense>
      </main>
    </div>
  );
}
