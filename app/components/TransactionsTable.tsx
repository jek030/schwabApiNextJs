"use client"

import { ProcessedTransaction } from '@/app/lib/utils';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/app/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';
import { Suspense, useState } from 'react';
import EmptyDataTableSkeleton from './empty-table-skeleton';
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";

const transactionColumns: ColumnDef<ProcessedTransaction>[] = [
  {
    id: "positionEffect",
    header: "Trade Type",
    accessorFn: (row) => row.trade.positionEffect,
    cell: ({ row }) => {
      const effect = row.getValue("positionEffect") as string;
      return effect.charAt(0) + effect.slice(1).toLowerCase();
    },
  },
  {
    accessorKey: "trade.symbol",
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
    id: "tradeDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Trade Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    accessorFn: (row) => new Date(row.tradeDate).getTime(), // Convert to timestamp for sorting
    cell: ({ row }) => {
      const date = new Date(row.getValue("tradeDate"));
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    },
  },
  {
    id: "amount",
    header: "Amount",
    accessorFn: (row) => row.trade.amount,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount") || "0");
      return amount.toString();
    },
  },
  {
    id: "price",
    header: "Price",
    accessorFn: (row) => row.trade.closingPrice,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || "0");
      return `$${price.toFixed(2)}`;
    },
  }, 
  {
    id: "cost",
    header: "Cost",
    accessorFn: (row) => row.trade.cost,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("cost") || "0");
      return `$${cost.toFixed(2)}`;
    },
  }, 
  {
    id: "commission",
    header: "Commission",
    accessorFn: (row) => row.fees.commission.cost,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("commission") || "0");
      return `$${cost.toFixed(2)}`;
    },
  },
  {
    id: "secFee",
    header: "SEC Fee",
    accessorFn: (row) => row.fees.secFee.cost,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("secFee") || "0");
      return `$${cost.toFixed(2)}`;
    },
  },
  {
    id: "optRegFee",
    header: "Opt Reg Fee",
    accessorFn: (row) => row.fees.optRegFee.cost,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("optRegFee") || "0");
      return `$${cost.toFixed(2)}`;
    },
  },
  {
    id: "tafFee",
    header: "TAF Fee",
    accessorFn: (row) => row.fees.tafFee.cost,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("tafFee") || "0");
      return `$${cost.toFixed(2)}`;
    },
  },
  {
    accessorKey: "netAmount",
    header: "Net Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("netAmount") || "0");
      return `$${amount.toFixed(2)}`;
    },
  },
];

function getRowClass(netAmount: string | number): string {
  const amount = typeof netAmount === 'string' ? parseFloat(netAmount) : netAmount;
  return amount >= 0 
    ? "bg-red-50 hover:bg-red-100" 
    : "bg-green-50 hover:bg-green-100";
}

export default function TransactionsTable({ 
  transactions, 
  accountNum,
  onDaysChange
}: { 
  transactions: ProcessedTransaction[], 
  accountNum: string,
  onDaysChange: (days: number) => void
}) {
  const [days, setDays] = useState(30);
  const [inputDays, setInputDays] = useState('30');

  const handleDaysSubmit = () => {
    const newDays = parseInt(inputDays) || 30;
    setDays(newDays);
    onDaysChange(newDays);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputDays(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleDaysSubmit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Last {days} days of transactions for account {accountNum}.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="days" className="text-sm text-gray-500">Days:</label>
            <div className="flex gap-2">
              <Input
                id="days"
                type="number"
                min="1"
                max="365"
                value={inputDays}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="w-24"
              />
              <Button 
                onClick={handleDaysSubmit}
                size="sm"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<EmptyDataTableSkeleton columns={transactionColumns} />}>
          <DataTable 
            columns={transactionColumns} 
            data={transactions}
            defaultSorting={[{
              id: "tradeDate",
              desc: true
            }]}
            getRowClass={(row) => getRowClass(row.netAmount)}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
} 