"use client"

import { useState, useEffect } from 'react';
import PageHeader from '@/app/components/PageHeader';
import { getAccountByNumber } from '@/app/lib/stores/accountStore';
import { useTransactions } from '@/app/hooks/useTransactions';
import PositionsCard from '@/app/components/PositionsCard';
import TransactionsCard from '@/app/components/TransactionsCard';
import TransactionCalendarCard from '@/app/components/TransactionCalendarCard';
import RealizedTradesTable from '@/app/components/RealizedTradesTable';
import PositionsPieChart from '@/app/components/PositionsPieChart';

export default function Page({ params }: { params: { account: string } }) {
  const [selectedDays, setSelectedDays] = useState(30);
  const [account, setAccount] = useState<any>(null);
  const { processedTransactions, calendarEvents, fetchTransactions } = useTransactions(params.account, selectedDays);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const accountData = await getAccountByNumber(params.account);
        if (!accountData) {
          throw new Error(`Account ${params.account} not found`);
        }
        setAccount(accountData);
      } catch (error) {
        console.error('Error fetching account:', error);
      }
    };

    fetchAccount();
  }, [params.account]);

  return (
    <div className="flex flex-col">
      <div className="pb-2">
        <PageHeader>
          This is the positions page.
        </PageHeader>
      </div>

      <main className="flex flex-col gap-2 sm:items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <PositionsCard accountNumber={params.account} account={account} />
          <PositionsPieChart positions={account?.positions || []} />
        </div>
        <TransactionsCard 
          transactions={processedTransactions} 
          accountNum={params.account}
          onDaysChange={setSelectedDays}
          fetchTransactions={fetchTransactions}
        />
        <RealizedTradesTable transactions={processedTransactions} />
        <TransactionCalendarCard calendarEvents={calendarEvents} />
      </main>
    </div>
  );
}