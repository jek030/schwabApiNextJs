"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Account } from "./utils";
import { Button } from "@/components/ui/button"
import Link from 'next/link';

export const columns: ColumnDef<Account>[] = [
    {
      accessorKey: "accountNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center"
          >
            Account Number
          </Button>
        )
      },
      cell: ({ row }) => {
        const acc = String(row.getValue("accountNumber"))
   
        return <div className="text-center">
          <Link className="border border-slate-300 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400" 
            href={{pathname: `/accounts/${ acc}/positions`}}>
            {acc}
          </Link>
        </div>
      },
    },
    {
      accessorKey: "accountValue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center"
          >
            Account Value
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("accountValue"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-center font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "accountEquity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center"
          >
            Account Equity
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("accountEquity"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-center font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "roundTrips",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center"
          >
           # of Round Trips
          </Button>
        )
      },
      cell: ({ row }) => {
        const value = Number(row.getValue("roundTrips"));
        return <div className="text-center font-medium">{value}</div>
      },
    },
    {
      accessorKey: "cashBalance",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center"
          >
            Cash Balance
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("cashBalance"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-center font-medium">{formatted}</div>
      },
    }
  ]
  