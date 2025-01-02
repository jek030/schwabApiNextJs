"use client"

import { useState, useEffect } from 'react';
import PageHeader from '@/app/components/PageHeader';
import { getAccountByNumber } from '@/app/lib/stores/accountStore';
import { useTransactions } from '@/app/hooks/useTransactions';
import PositionsCard from '@/app/components/PositionsCard';
import TransactionsCard from '@/app/components/TransactionsCard';
import TransactionCalendarCard from '@/app/components/TransactionCalendarCard';
import RealizedTradesTable, { calculateRealizedTrades } from '@/app/components/RealizedTradesTable';
import PositionsPieChart from '@/app/components/PositionsPieChart';
import RealizedTradesAnalytics from '@/app/components/RealizedTradesAnalytics';
import { Input } from '@/app/ui/input';
import { Button } from '@/app/ui/button';
import CumulativePnLChart from '@/app/components/CumulativePnLChart';
import WinRateChart from '@/app/components/WinRateChart';

export default function Page({ params }: { params: { account: string } }) {
  const today = new Date();
  const [selectedDays, setSelectedDays] = useState(30);
  const [account, setAccount] = useState<any>(null);
  const { processedTransactions, calendarEvents, fetchTransactions } = useTransactions(params.account, selectedDays);
  const [symbolFilter, setSymbolFilter] = useState('');
  const [startDate, setStartDate] = useState(new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  const realizedTrades = calculateRealizedTrades(processedTransactions);
  const filteredTrades = realizedTrades.filter(trade => {
    const sellDate = new Date(trade.sellDate);
    const endDatePlusOne = endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : new Date();
    
    const dateMatches = (!startDate || sellDate >= new Date(startDate)) && 
                       (!endDate || sellDate < endDatePlusOne);
    const symbolMatches = !symbolFilter || 
                         trade.symbol.toLowerCase().includes(symbolFilter.toLowerCase());
    return dateMatches && symbolMatches;
  });

  const filteredCalendarEvents = calendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    const endDatePlusOne = endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : new Date();
    
    const dateMatches = (!startDate || eventDate >= new Date(startDate)) && 
                       (!endDate || eventDate < endDatePlusOne);
    const symbolMatches = !symbolFilter || 
                         event.title.toLowerCase().includes(symbolFilter.toLowerCase());
    return dateMatches && symbolMatches;
  });

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="col-span-2">
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Symbol:</span>
                <Input
                  type="text"
                  value={symbolFilter}
                  onChange={(e) => setSymbolFilter(e.target.value)}
                  placeholder="Filter by symbol"
                  className="w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">From:</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">To:</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setSymbolFilter('');
                }}
              >
                Clear
              </Button>
            </div>
          </div>
          <RealizedTradesTable trades={filteredTrades} />
          <RealizedTradesAnalytics trades={filteredTrades} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <CumulativePnLChart trades={filteredTrades} />
          <WinRateChart trades={filteredTrades} />
        </div>
        <TransactionCalendarCard calendarEvents={filteredCalendarEvents} />
      </main>
    </div>
  );
}