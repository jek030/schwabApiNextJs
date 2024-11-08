"use client"

import React from "react";

import { DataTablePagination } from "./table-pagination";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })
 
  return (
    <div>
      <div className="rounded-md border">

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
    )
}




/*


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
        <Table >
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
            {accounts.map((acc) => (
              <TableRow key={acc.key} className = "hover:bg-white">
                <TableCell className="hidden md:table-cell">{
                  <Link className="border border-black rounded-md bg-gradient-to-br from-blue-300 via-white to-blue-200 px-4 py-2 text-sm text-black transition-colors hover:bg-blue-400" 
                        href={{pathname: `/accounts/${ acc.accountNumber}/positions`}}>
                    {acc.accountNumber}
                   </Link>}
                </TableCell>
                <TableCell className="hidden md:table-cell whitespace-nowrap px-4 py-5 text-s">${formatter.format(acc.accountValue)}</TableCell>
                <TableCell className="hidden md:table-cell">${formatter.format(acc.accountEquity)}</TableCell>
                <TableCell className="hidden md:table-cell">{acc.roundTrips}</TableCell>
                <TableCell className="hidden md:table-cell">${formatter.format(acc.cashBalance)}</TableCell>
              </TableRow> 
            )) }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
 )
}
*/