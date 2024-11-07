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
import { Position } from "../lib/utils";

export const columns: ColumnDef<Position>[] = [
    {
      accessorKey: "symbol",
      header: () => <div className="text-right">Symbol</div>,
      cell: ({ row }) => {
        const symbol = String(row.getValue("symbol"))
   
        return <Link className="border border-black rounded-md bg-blue-400  px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400" 
                     href={{pathname:  `/ticker/${symbol}`}}>
                     ${symbol}
               </Link>
      },
    },

    {
      accessorKey: "marketValue",
      header: () => <div className="text-right">Market Value</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("marketValue"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "averagePrice",
      header: () => <div className="text-right">Avg Price</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("averagePrice"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "pnl",
      header: () => <div className="text-right">P/L ($)</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("pnl"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
        accessorKey: "netChange",
        header: "Net Change",
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
  