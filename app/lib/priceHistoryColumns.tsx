"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Position } from "./utils";

export const columns: ColumnDef<Position>[] = [  
    {
        accessorKey: "datetime",
        header: () => <div className="text-center">Date</div>,
        cell: ({ row }) => {
          const date = new Date(row.getValue("datetime")).toLocaleDateString('en-US');
     
          return <div className="text-center font-medium">{date}</div>
        },
      },
    {
      accessorKey: "open",
      header: () => <div className="text-center">Open</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("open"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-center font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "high",
      header: () => <div className="text-center">High</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("high"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-center font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "low",
      header: () => <div className="text-center">Low</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("low"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-center font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "close",
      header: () => <div className="text-center">Close</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("close"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
   
        return <div className="text-center font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "volume",
      header: () => <div className="text-center">Volume</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("volume"))
        const formatted = new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 0
        }).format(amount)

        return <div className="text-center font-medium">{formatted}</div>
      },
    },
    
]
  