"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Position } from "./utils";

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
          </Button>
        )
      },
      cell: ({ row }) => {
        const symbol = String(row.getValue("symbol"))
   
        return <Link className="border border-slate-300 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                     href={{pathname:  `/search/${symbol}`}}>
                     ${symbol}
               </Link>
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
          </Button>
        )
      },
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Avg Price
          </Button>
        )
      },
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
      accessorKey: "longQuantity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("longQuantity"))
        const formatted = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount)
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "pnl",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            P/L ($)
          </Button>
        )
      },
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
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Net Change
            </Button>
          )
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
  