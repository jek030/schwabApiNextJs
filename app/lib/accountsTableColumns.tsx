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
          >
            Account Number
          </Button>
        )
      },
      cell: ({ row }) => {
        const acc = String(row.getValue("accountNumber"))
   
        return <Link className="border border-slate-300 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400" 
        href={{pathname: `/accounts/${ acc}/positions`}}>
        {acc}
        </Link>
      },
    },
    {
      accessorKey: "accountValue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "accountEquity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "roundTrips",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
           # of Round Trips
          </Button>
        )
      },
    },
    {
      accessorKey: "cashBalance",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    }
    
    //{
    //    id: "actions",
    //    cell: ({ row }) => {
    //      const account = row.original
    // 
    //      return (
    //        <DropdownMenu>
    //          <DropdownMenuTrigger asChild>
    //            <Button variant="ghost" className="h-8 w-8 p-0">
    //              <span className="sr-only">Open menu</span>
    //              <MoreHorizontal className="h-4 w-4" />
    //            </Button>
    //          </DropdownMenuTrigger>
    //          <DropdownMenuContent align="end">
    //            <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //            <DropdownMenuItem
    //              onClick={() => navigator.clipboard.writeText(account.accountNumber)}
    //            >
    //              Copy payment ID
    //            </DropdownMenuItem>
    //            <DropdownMenuSeparator />
    //            <DropdownMenuItem>View customer</DropdownMenuItem>
    //            <DropdownMenuItem>View payment details</DropdownMenuItem>
    //          </DropdownMenuContent>
    //        </DropdownMenu>
    //      )
    //    },
    //  },
  ]
  