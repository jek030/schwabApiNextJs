"use client"

import { ProcessedTransaction } from '@/app/lib/utils';
import { DataTable } from "@/app/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/ui/card';
import { useState } from 'react';
import { Input } from "@/app/ui/input";
import { Button } from "@/app/ui/button";

interface RealizedTrade {
  symbol: string;
  buyDate: string;
  sellDate: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  buyTotal: number;
  sellTotal: number;
  realizedGainLoss: number;
  percentageGain: number;
  commission: number;
  secFee: number;
  optRegFee: number;
  tafFee: number;
}

const realizedTradeColumns: ColumnDef<RealizedTrade>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "buyDate",
    header: "Buy Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("buyDate"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "sellDate",
    header: "Sell Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("sellDate"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "buyPrice",
    header: "Buy Price",
    cell: ({ row }) => {
      return `$${row.getValue<number>("buyPrice").toFixed(2)}`;
    },
  },
  {
    accessorKey: "sellPrice",
    header: "Sell Price",
    cell: ({ row }) => {
      return `$${row.getValue<number>("sellPrice").toFixed(2)}`;
    },
  },
  {
    accessorKey: "buyTotal",
    header: "Buy Total",
    cell: ({ row }) => {
      return `$${row.getValue<number>("buyTotal").toFixed(2)}`;
    },
  },
  {
    accessorKey: "sellTotal",
    header: "Sell Total",
    cell: ({ row }) => {
      return `$${row.getValue<number>("sellTotal").toFixed(2)}`;
    },
  },
  {
    accessorKey: "realizedGainLoss",
    header: "Realized G/L",
    cell: ({ row }) => {
      const amount = row.getValue<number>("realizedGainLoss");
      return (
        <span className={amount >= 0 ? "text-green-600" : "text-red-600"}>
          ${amount.toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: "percentageGain",
    header: "% Gain/Loss",
    cell: ({ row }) => {
      const percentage = row.getValue<number>("percentageGain");
      return (
        <span className={percentage >= 0 ? "text-green-600" : "text-red-600"}>
          {percentage.toFixed(2)}%
        </span>
      );
    },
  },
  {
    id: "commission",
    header: "Commission",
    accessorKey: "commission",
    cell: ({ row }) => {
      const cost = row.getValue<number>("commission");
      return `$${cost.toFixed(2)}`;
    },
  },
  {
    id: "secFee",
    header: "SEC Fee",
    accessorKey: "secFee",
    cell: ({ row }) => {
      const cost = row.getValue<number>("secFee");
      return `$${cost.toFixed(2)}`;
    },
  },
  {
    id: "optRegFee",
    header: "Opt Reg Fee",
    accessorKey: "optRegFee",
    cell: ({ row }) => {
      const cost = row.getValue<number>("optRegFee");
      return `$${cost.toFixed(2)}`;
    },
  },
  {
    id: "tafFee",
    header: "TAF Fee",
    accessorKey: "tafFee",
    cell: ({ row }) => {
      const cost = row.getValue<number>("tafFee");
      return `$${cost.toFixed(2)}`;
    },
  },
];

export function calculateRealizedTrades(transactions: ProcessedTransaction[]): RealizedTrade[] {
  const positions: { [symbol: string]: { quantity: number; cost: number; date: string }[] } = {};
  const realizedTrades: RealizedTrade[] = [];

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime()
  );

  for (const transaction of sortedTransactions) {
    const symbol = transaction.trade.symbol;
    const quantity = Math.abs(transaction.trade.amount);
    const price = Math.abs(transaction.trade.cost / transaction.trade.amount);
    
    if (transaction.trade.positionEffect.toUpperCase() === 'OPENING') {
      // Buy transaction
      if (!positions[symbol]) {
        positions[symbol] = [];
      }
      positions[symbol].push({
        quantity,
        cost: price,
        date: transaction.tradeDate
      });
    } else if (transaction.trade.positionEffect.toUpperCase() === 'CLOSING') {
      // Get fees once for the entire sell transaction
      const commission = transaction.fees.commission.cost || 0;
      const secFee = transaction.fees.secFee.cost || 0;
      const optRegFee = transaction.fees.optRegFee.cost || 0;
      const tafFee = transaction.fees.tafFee.cost || 0;
      const totalFees = commission + secFee + optRegFee + tafFee;
      
      let remainingQuantity = quantity;
      const buyLots = positions[symbol] || [];
      let isFirstLot = true; // Track if this is the first lot
      
      while (remainingQuantity > 0 && buyLots.length > 0) {
        const oldestLot = buyLots[0];
        const lotQuantity = Math.min(remainingQuantity, oldestLot.quantity);
        
        const buyTotal = lotQuantity * oldestLot.cost;
        const sellTotal = lotQuantity * price;
        
        // Only apply fees to the first lot by adding to the realized gain/loss
        const feesForThisLot = isFirstLot ? totalFees : 0;
        const realizedGainLoss = sellTotal - buyTotal + feesForThisLot;
        const percentageGain = (realizedGainLoss / buyTotal) * 100;

        realizedTrades.push({
          symbol,
          buyDate: oldestLot.date,
          sellDate: transaction.tradeDate,
          quantity: lotQuantity,
          buyPrice: oldestLot.cost,
          sellPrice: price,
          buyTotal,
          sellTotal,
          realizedGainLoss,
          percentageGain,
          // Only include fees in the first lot
          commission: isFirstLot ? commission : 0,
          secFee: isFirstLot ? secFee : 0,
          optRegFee: isFirstLot ? optRegFee : 0,
          tafFee: isFirstLot ? tafFee : 0,
        });

        remainingQuantity -= lotQuantity;
        oldestLot.quantity -= lotQuantity;
        isFirstLot = false; // Mark subsequent lots
        
        if (oldestLot.quantity === 0) {
          buyLots.shift();
        }
      }
    }
  }

  return realizedTrades;
}

export default function RealizedTradesTable({ trades }: { trades: RealizedTrade[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Realized Trades</CardTitle>
        <CardDescription>
          Realized gains and losses calculated using FIFO method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={realizedTradeColumns} 
          data={trades}
          defaultSorting={[{
            id: "sellDate",
            desc: true
          }]}
        />
      </CardContent>
    </Card>
  );
}
