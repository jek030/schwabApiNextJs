"use client"

import { useState, useEffect } from 'react';
import PageHeader from '@/app/components/PageHeader';
import { getAccountByNumber } from '@/app/lib/stores/accountStore';
import { useTransactions } from '@/app/hooks/useTransactions';
import PositionsCard from '@/app/components/PositionsCard';
import TransactionsCard from '@/app/components/TransactionsCard';
import TransactionCalendarCard from '@/app/components/TransactionCalendarCard';

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
        <PositionsCard accountNumber={params.account} account={account} />
        <TransactionsCard 
          transactions={processedTransactions} 
          accountNum={params.account}
          onDaysChange={setSelectedDays}
          fetchTransactions={fetchTransactions}
        />
        <TransactionCalendarCard calendarEvents={calendarEvents} />
      </main>
    </div>
  );
}