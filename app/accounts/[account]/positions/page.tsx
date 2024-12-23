"use client"

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';
import { Suspense, useState, useEffect } from 'react';
import EmptyDataTableSkeleton from '../../../components/empty-table-skeleton';
import { columns } from '@/app/lib/positionsTableColumns';
import { DataTable } from '@/app/ui/table';
import { getAccountByNumber } from '@/app/lib/stores/accountStore';
import PageHeader from '@/app/components/PageHeader';
import { Position, TransactionFee, ProcessedTransaction } from '@/app/lib/utils';
import Calendar from '@/app/components/Calendar';
import TransactionsTable from '@/app/components/TransactionsTable';

type CalendarEvent = {
  date: string;
  title: string;
  category: 'profit' | 'loss';
  transaction?: ProcessedTransaction;
};

// Separate component for positions data
function PositionsDataTable({ account, params }: { account: any, params: { account: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account {params.account}</CardTitle>
        <CardDescription>
          View positions for account {params.account} retrieved from the Charles Schwab API.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={account.positions} />
      </CardContent>
    </Card>
  );
}

// Separate component for transactions and calendar
function TransactionsAndCalendar({ 
  accountNum, 
  selectedDays, 
  setSelectedDays 
}: { 
  accountNum: string;
  selectedDays: number;
  setSelectedDays: (days: number) => void;
}) {
  const [processedTransactions, setProcessedTransactions] = useState<ProcessedTransaction[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // Helper function to create calendar events
  const createCalendarEvents = (transactions: ProcessedTransaction[]): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    
    for (const transaction of transactions) {
      if (!transaction.tradeDate) continue;
      
      const tradeDate = new Date(transaction.tradeDate);
      const date = `${tradeDate.getFullYear()}-${String(tradeDate.getMonth() + 1).padStart(2, '0')}-${String(tradeDate.getDate()).padStart(2, '0')}`;
      
      const amount = Math.abs(transaction.trade.amount);
      const formattedCost = transaction.netAmount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      
      events.push({
        date,
        title: `<b>${transaction.trade.symbol}</b> ${transaction.trade.positionEffect} ${amount}x ${formattedCost}`,
        category: transaction.netAmount <= 0 ? 'profit' : 'loss',
        transaction
      });
    }
    
    console.log('Created calendar events:', events);
    return events;
  };

  const fetchTransactions = async (days: number) => {
    try {
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = window.location.host;
      
      // Get hash value
      const hashResponse = await fetch(
        `${protocol}://${host}/api/schwab/hashedAcc?accountNumber=${accountNum}`
      );
      if (!hashResponse.ok) {
        throw new Error(`Failed to fetch hashed accounts. Status: ${hashResponse.status}`);
      }
      const hashData = await hashResponse.json();
      const hashValue = hashData.hashValue;

      if (!hashValue) {
        throw new Error('No hash value available for transactions fetch');
      }

      // Fetch transactions
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

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
      const processedData = await response.json();
      console.log('Processed transactions:', processedData);
      setProcessedTransactions(processedData);
      
      // Create and set calendar events
      const events = createCalendarEvents(processedData);
      console.log('Setting calendar events:', events);
      setCalendarEvents(events);

    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Fetch initial transactions
  useEffect(() => {
    fetchTransactions(selectedDays);
  }, [selectedDays]);

  return (
    <>
      <TransactionsTable 
        transactions={processedTransactions} 
        accountNum={accountNum}
        onDaysChange={setSelectedDays}
      />

      <div className="w-full mt-8">
        {calendarEvents.length > 0 ? (
          <Calendar events={calendarEvents} />
        ) : (
          <div>No transaction events to display</div>
        )}
      </div>
    </>
  );
}

export default function Page({ params }: { params: { account: string } }) {
  const [selectedDays, setSelectedDays] = useState(30);
  const [processedTransactions, setProcessedTransactions] = useState<ProcessedTransaction[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [account, setAccount] = useState<any>(null);

  // Add this function back
  const createCalendarEvents = (transactions: ProcessedTransaction[]): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    
    for (const transaction of transactions) {
      if (!transaction.tradeDate) continue;
      
      const tradeDate = new Date(transaction.tradeDate);
      const date = `${tradeDate.getFullYear()}-${String(tradeDate.getMonth() + 1).padStart(2, '0')}-${String(tradeDate.getDate()).padStart(2, '0')}`;
      
      const amount = Math.abs(transaction.trade.amount);
      const formattedCost = transaction.netAmount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      
      events.push({
        date,
        title: `<b>${transaction.trade.symbol}</b> ${transaction.trade.positionEffect} ${amount}x ${formattedCost}`,
        category: transaction.netAmount <= 0 ? 'profit' : 'loss',
        transaction
      });
    }
    
    return events;
  };

  // Fetch account data
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

  // Fetch initial transactions
  useEffect(() => {
    fetchTransactions(selectedDays);
  }, [selectedDays]);

  const fetchTransactions = async (days: number) => {
    try {
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = window.location.host;
      
      const hashResponse = await fetch(
        `${protocol}://${host}/api/schwab/hashedAcc?accountNumber=${params.account}`
      );
      if (!hashResponse.ok) throw new Error(`Failed to fetch hashed accounts. Status: ${hashResponse.status}`);
      const hashData = await hashResponse.json();
      if (!hashData.hashValue) throw new Error('No hash value available for transactions fetch');

      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const response = await fetch(`${protocol}://${host}/api/schwab/transactions?` + new URLSearchParams({
        hashedAccount: hashData.hashValue,
        startDate,
        endDate,
        types: 'TRADE'
      }));
      
      if (!response.ok) throw new Error(`Failed to fetch transactions. Status: ${response.status}`);
      const processedData = await response.json();
      setProcessedTransactions(processedData);
      
      const events = createCalendarEvents(processedData);
      setCalendarEvents(events);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="pb-2">
        <PageHeader>
          This is the positions page.
        </PageHeader>
      </div>

      <main className="flex flex-col gap-2 sm:items-start">
        <Card>
          <CardHeader>
            <CardTitle>Account {params.account}</CardTitle>
            <CardDescription>
              View positions for account {params.account} retrieved from the Charles Schwab API.
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
                transactions={processedTransactions} 
                accountNum={params.account}
                onDaysChange={setSelectedDays}
              />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Calendar</CardTitle>
            <CardDescription>
              View your transactions in a calendar format.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
              <div className="animate-pulse space-y-4">
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            }>
              {calendarEvents.length > 0 ? (
                <Calendar events={calendarEvents} />
              ) : (
                <div>No transaction events to display</div>
              )}
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}