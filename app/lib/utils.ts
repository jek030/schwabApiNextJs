"useClient";

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
}
