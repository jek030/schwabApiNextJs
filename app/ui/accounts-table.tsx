"use client"

import React from "react";
import Link from 'next/link';
import { Divider } from "@nextui-org/react";
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from '@/app/ui/card';//CardFooter
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from '@/app/ui/table';

import { Account } from "../lib/utils";


const columns = [
  {
    key: "accountNumber",
    label: "Account Number",
  },
  {
    key: "accountValue",
    label: "Account Value",
  },
  {
    key: "accountEquity",
    label: "Account Equity",
  },
  {
    key: "roundTrips",
    label: "# of Round Trips",
  },
  {
    key: "cashBalance",
    label: "Cash Balance",
  }
]

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export default function AccountTable({accounts }: {accounts: Account[]}) {

  return (
   <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        
        <CardDescription>
          View accounts retrieved form Charles Schwab API.
        </CardDescription>
      </CardHeader>
      <Divider/>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow >
              {columns.map((col) => 
                <TableHead key={col.key} className="hidden w-[100px] sm:table-cell">
                          {col.label} 
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
            
          <TableBody >
            {accounts.map((item) => (
              <TableRow className = "hover:bg-white">
                <TableCell className="hidden md:table-cell">{
                  <Link className="border border-black rounded-md bg-gradient-to-br from-blue-300 via-white to-blue-200 px-4 py-2 text-sm text-black transition-colors hover:bg-blue-400" 
                        href={{pathname: `/accounts/${ item.accountNumber}/positions`}}>
                    {item.accountNumber}
                   </Link>}
                </TableCell>
                <TableCell className="hidden md:table-cell whitespace-nowrap px-4 py-5 text-s">${formatter.format(item.accountValue)}</TableCell>
                <TableCell className="hidden md:table-cell">${formatter.format(item.accountEquity)}</TableCell>
                <TableCell className="hidden md:table-cell">{item.roundTrips}</TableCell>
                <TableCell className="hidden md:table-cell">${formatter.format(item.cashBalance)}</TableCell>
              </TableRow> 
            )) }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
 )
}
