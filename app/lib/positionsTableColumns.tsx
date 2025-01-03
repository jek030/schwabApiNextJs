"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/app/ui/button"
import Link from 'next/link';
import { Position } from "./utils";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Position>[] = [
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
      cell: ({ row }) => {
        const symbol = String(row.getValue("symbol"))
   
        return <div className="text-center">
          <Link className="border border-slate-300 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                href={{pathname:  `/search/${symbol}`}}>
                ${symbol}
          </Link>
        </div>
      },
    },
    {
      accessorKey: "netChange",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Net Change
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
    {
      accessorKey: "marketValue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Market Value
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("marketValue"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-center font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "averagePrice",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Avg Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("averagePrice"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-center font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "longQuantity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("longQuantity"))
        const formatted = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount)
   
        return <div className="text-center font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "longOpenProfitLoss",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            P/L ($)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("longOpenProfitLoss"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return (
          <div 
            className={`text-center font-medium ${
              amount > 0 ? 'text-green-600' : amount < 0 ? 'text-red-600' : ''
            }`}
          >
            {formatted}
          </div>
        )
      },
    },
    
  ]
  