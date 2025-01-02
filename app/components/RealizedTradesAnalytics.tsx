"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';
import { DataTable } from "@/app/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/app/ui/button";
import { ArrowUpDown } from "lucide-react";

interface RealizedTrade {
  symbol: string;
  realizedGainLoss: number;
  percentageGain: number;
}

interface SymbolAnalytics {
  symbol: string;
  totalTrades: number;
  avgGainLoss: number;
  winRate: number;
  totalGainLoss: number;
}

const symbolColumns: ColumnDef<SymbolAnalytics>[] = [
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Symbol
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "totalTrades",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          # Trades
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "winRate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Win Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return `${row.getValue<number>("winRate").toFixed(1)}%`;
    },
  },
  {
    accessorKey: "avgGainLoss",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Avg P/L
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue<number>("avgGainLoss");
      return (
        <span className={amount >= 0 ? "text-green-600" : "text-red-600"}>
          ${amount.toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: "totalGainLoss",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total P/L
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue<number>("totalGainLoss");
      return (
        <span className={amount >= 0 ? "text-green-600" : "text-red-600"}>
          ${amount.toFixed(2)}
        </span>
      );
    },
  },
];

export default function RealizedTradesAnalytics({ trades }: { trades: RealizedTrade[] }) {
  // Calculate overall statistics
  const totalTrades = trades.length;
  const totalGainLoss = trades.reduce((sum, trade) => sum + trade.realizedGainLoss, 0);
  const avgGainLoss = totalGainLoss / totalTrades;
  const winningTrades = trades.filter(t => t.realizedGainLoss > 0).length;
  const overallWinRate = (winningTrades / totalTrades) * 100;

  // Calculate per-symbol statistics
  const analytics = trades.reduce((acc: { [key: string]: SymbolAnalytics }, trade) => {
    if (!acc[trade.symbol]) {
      acc[trade.symbol] = {
        symbol: trade.symbol,
        totalTrades: 0,
        avgGainLoss: 0,
        winRate: 0,
        totalGainLoss: 0,
      };
    }
    
    acc[trade.symbol].totalTrades++;
    acc[trade.symbol].totalGainLoss += trade.realizedGainLoss;
    acc[trade.symbol].avgGainLoss = acc[trade.symbol].totalGainLoss / acc[trade.symbol].totalTrades;
    
    const symbolWins = trades
      .filter(t => t.symbol === trade.symbol && t.realizedGainLoss > 0)
      .length;
    const symbolTotal = trades.filter(t => t.symbol === trade.symbol).length;
    acc[trade.symbol].winRate = (symbolWins / symbolTotal) * 100;
    
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Statistics with better formatting */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Overall Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Total Trades</p>
                <p className="text-2xl font-semibold">{totalTrades}</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Total P/L</p>
                <p className={`text-2xl font-semibold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Average P/L per Trade</p>
                <p className={`text-2xl font-semibold ${avgGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${avgGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Win Rate</p>
                <p className="text-2xl font-semibold">{overallWinRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Symbol Breakdown Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Symbol Breakdown</h3>
            <div className="max-h-[300px] overflow-y-auto rounded-md border">
              <DataTable 
                columns={symbolColumns} 
                data={Object.values(analytics)}
                defaultSorting={[{
                  id: "totalGainLoss",
                  desc: true
                }]}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 