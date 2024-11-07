"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Account } from "../lib/utils";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export const columns: ColumnDef<Account>[] = [
    {
      accessorKey: "accountNumber",
      header: () => <div className="text-right">Account Number</div>,
      cell: ({ row }) => {
        const acc = String(row.getValue("accountNumber"))
   
        return <Link className="border border-black rounded-md bg-gradient-to-br from-blue-300 via-white to-blue-200 px-4 py-2 text-sm text-black transition-colors hover:bg-blue-400" 
        href={{pathname: `/accounts/${ acc}/positions`}}>
        {acc}
        </Link>
      },
    },
    {
      accessorKey: "accountValue",
      header: () => <div className="text-right">Account Value</div>,
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
      header: () => <div className="text-right">Account Equity</div>,
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
      header: "# of Round Trips",
    },
    {
      accessorKey: "cashBalance",
      header: () => <div className="text-right">Cash Balance</div>,
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
  