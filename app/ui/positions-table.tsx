"use client"

import React from "react";
import Link from 'next/link';
import { Divider } from "@nextui-org/react";
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from '@/app/ui/card';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from '@/app/ui/table';

import { Account, Position } from "../lib/utils";


const columns = [
    {
      key: "ticker",
      label: "Ticker"   
    },
    {
      key: "marketValue",
      label: "Market Value"
    },
    {
      key: "averagePrice",
      label: "Avg Price"
    },
    {
      key: "quantity",
      label: "Quantity"
    },
    {
      key: "pnl",
      label: "P/L ($)"
    },
    {
      key: "netChange",
      label: "Net Change "
    }
  ]

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export default function PositionsTable({positions, accountNumber }: {positions: Position[], accountNumber: string}) {
 
  return (
    <Card>
            <CardHeader>
              <CardTitle>Account {accountNumber}</CardTitle>       
                <CardDescription>
                  View positions for account {accountNumber} retrieved from the Charles Schwab API.
                </CardDescription>
            </CardHeader>
            <Divider/>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow >
                    {columns.map((col) =>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                                {col.label} 
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                  
                <TableBody >
                { positions != undefined &&  positions.length != 0  && positions.map(pos => 
                    <TableRow className = "hover:bg-white">
                      <TableCell className="hidden md:table-cell">
                          <Link className="border border-black rounded-md bg-gradient-to-br from-blue-300 via-white to-blue-200 px-4 py-2 text-sm text-black transition-colors hover:bg-blue-400" 
                                href={{pathname:  `/ticker/${pos.symbol }`}}>
                                  ${pos.symbol}
                          </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell whitespace-nowrap px-4 py-5 text-s">${formatter.format(pos.marketValue)}</TableCell>
                      <TableCell className="hidden md:table-cell">${formatter.format(pos.averagePrice)}</TableCell>
                      <TableCell className="hidden md:table-cell">{pos.longQuantity}</TableCell>            
                      <TableCell className="hidden md:table-cell">${formatter.format(pos.longOpenProfitLoss)}</TableCell>
                      <TableCell className="hidden md:table-cell">${pos.netChange}</TableCell>               
                    </TableRow> 
                  ) }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
 )
}
