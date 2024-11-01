"use client"

import React from "react";
import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow, getKeyValue
} from "@nextui-org/table";

import { Account } from "../lib/Account";


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

export default function AccountTable({accounts }: {accounts: Account[]}) {

  const renderCell = React.useCallback((account, columnKey) => {
    const cellValue = account[columnKey];
    console.log("bello " + cellValue)

    switch (columnKey) {
      case "accountNumber":
        return (
          <Link className="border border-black mt-4 rounded-md bg-green-500 px-4 py-2 text-sm text-black transition-colors hover:bg-blue-400" 
                              href={{pathname: `/accounts/${cellValue}/positions`}}>
                                      {cellValue}
                        </Link>
        );
          
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="">
      <Table aria-label="Accounts Table">
        <TableHeader columns={columns}>
          {column => <TableColumn key={column.key}> {column.label}</TableColumn>}
        </TableHeader>

        <TableBody items={accounts}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}

            </TableRow>                                  
            )}

      </TableBody>
      </Table>
    </div>
  )
}
