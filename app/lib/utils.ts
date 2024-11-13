"useClient";

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import mysql from 'mysql2/promise';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface AccountsTableProps {
  initialData: Account[];
}

export type Position = {
  key: string
  symbol: string
  marketValue: number
  averagePrice: number
  longQuantity: number
  longOpenProfitLoss: number
  netChange: string
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