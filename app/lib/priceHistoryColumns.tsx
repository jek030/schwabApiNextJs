import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button"


interface PriceHistory {
    key: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    datetime: string;
    change: string;
}
export const columns: ColumnDef<PriceHistory>[] = [  
    {
        accessorKey: "datetime",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="w-full justify-center"
              >
                Date
              </Button>
            )
        },
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
    {
        accessorKey: "change",
        header: () => <div className="text-center">Daily Change</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("change"))
          const formatted = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            signDisplay: 'always'
          }).format(amount)
  
          return <div className="text-center font-medium" style={{ color: amount < 0 ? 'red' : 'green' }}>{formatted}%</div>
        },
      },
    
]
  