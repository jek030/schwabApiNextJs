"useClient";

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import mysql from 'mysql2/promise';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFirstBusinessDay = () => {
  const date = new Date();
  date.setMonth(0); // January
  date.setDate(1);  // First day of year
  
  // Keep moving forward until we hit a weekday (Mon-Fri)
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  
  return date.toISOString().split('T')[0];
};

export interface AccountsTableProps {
  initialData: Account[];
}

export type Ticker = {
  key: string
  symbol: string
  description: string
  mark: number
  netChange: number
  netPercentChange: number
  "52WeekHigh": number
  "52WeekLow": number
  "10DayAverageVolume": number
  "1YearAverageVolume": number
  peRatio: number
  eps: number
  nextDivExDate: string
  nextDivPayDate: string
  divYield: number
  regularMarketLastPrice: number
  totalVolume: number
  regularMarketNetChange: number
  regularMarketPercentChange: number
  closePrice: number
  highPrice: number
  lowPrice: number
  postMarketChange: number
  postMarketPercentChange: number
}

export type Position = {
  key: string
  symbol: string
  marketValue: number
  averagePrice: number
  longQuantity: number
  longOpenProfitLoss: number
  netChange: string
  dayProfitLoss: number
}

export type Account = {
  key: string
  accountNumber: string
  roundTrips: number
  accountValue: number
  accountEquity: number
  cashBalance: number
  positions: Position[]
}

export interface IAccount extends mysql.RowDataPacket {
  accountNumber: string
  roundTrips: number
  accountValue: number
  accountEquity: number
  cashBalance: number
  date: string
}

export interface IInsertAccount {
  accountNumber: string
  roundTrips: number
  accountValue: number
  accountEquity: number
  cashBalance: number
  date: string
}

export interface IPost {
  id: number;
  content: string;
}
export interface PriceHistory {
    key: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    datetime: string;
    change: string;
}
export interface PolygonSMAResponse {
  results: {
    values: {
      timestamp: number;
      value: number;
    }[];
  };
  status?: string;
  request_id?: string;
}

export interface TransactionFee {
  feeType: string;
  amount: number;
  cost: number;
}

export interface ProcessedTransaction {
  accountNumber: string;
  type: string;
  tradeDate: string;
  netAmount: number;
  fees: {
    commission: TransactionFee;
    secFee: TransactionFee;
    optRegFee: TransactionFee;
    tafFee: TransactionFee;
  };
  trade: {
    symbol: string;
    closingPrice: number;
    amount: number;
    cost: number;
    price: number;
    positionEffect: string;
  };
}