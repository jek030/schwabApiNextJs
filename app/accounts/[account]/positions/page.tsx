import Link from 'next/link';
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';//CardFooter
import { Suspense } from 'react';
import EmptyDataTableSkeleton from '../../../lib/empty-table-skeleton';
import { columns } from '@/app/lib/positionsTableColumns';
import { DataTable } from '@/app/ui/table';
import { getAccountByNumber } from '@/app/lib/accountStore';

export default async function Page({params} : {params: {account: string}}) {
  const account = await getAccountByNumber(params.account);
  if (!account) {
    throw new Error(`Account ${params.account} not found`);
  }

  const accountNum = params.account;
  
    return (

      <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <header className="flex flex-col sm:items-start"> 
          <p className=" text-gray-800 md:text-2xl md:leading-normal">
             <strong>Welcome to FinanceGuy.</strong> This is the positions page.
          </p>
          
        </header>
        <main className="flex flex-col gap-8 sm:items-start">
        <p >
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

          <Suspense fallback={EmptyDataTableSkeleton(columns)}>
            <DataTable columns={columns} data={account.positions}/>
            </Suspense>
          </CardContent>
        </Card>
        
        </main>    
      </div>
    );
  }