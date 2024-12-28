import { useState, useEffect } from 'react';
import { ProcessedTransaction, CalendarEvent } from '@/app/lib/utils';

export function useTransactions(accountNumber: string, selectedDays: number) {
  const [processedTransactions, setProcessedTransactions] = useState<ProcessedTransaction[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const createCalendarEvents = (transactions: ProcessedTransaction[]): CalendarEvent[] => {
    return transactions.map(transaction => {
      if (!transaction.tradeDate) return null;
      
      const tradeDate = new Date(transaction.tradeDate);
      const date = `${tradeDate.getFullYear()}-${String(tradeDate.getMonth() + 1).padStart(2, '0')}-${String(tradeDate.getDate()).padStart(2, '0')}`;
      
      const amount = Math.abs(transaction.trade.amount);
      const formattedCost = transaction.netAmount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      
      return {
        date,
        title: `<b>${transaction.trade.symbol}</b> ${transaction.trade.positionEffect} ${amount}x ${formattedCost}`,
        category: transaction.netAmount <= 0 ? 'profit' : 'loss',
        transaction
      };
    }).filter(Boolean) as CalendarEvent[];
  };

  const fetchTransactions = async (days: number) => {
    try {
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = window.location.host;
      
      const hashResponse = await fetch(
        `${protocol}://${host}/api/schwab/hashedAcc?accountNumber=${accountNumber}`
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

  useEffect(() => {
    fetchTransactions(selectedDays);
  }, [selectedDays, accountNumber]);

  return { processedTransactions, calendarEvents, fetchTransactions };
} 