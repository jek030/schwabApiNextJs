"use client";
import { useEffect, useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Suspense } from 'react';
import EmptyDataTableSkeleton from '@/app/accounts/empty-table-skeleton';
import { columns } from '@/app/lib/priceHistoryColumns';
import { DataTable } from "@/app/ui/table";
import { getPriceHistory } from '@/app/lib/getSchwabPriceHistory';
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from '@/app/ui/card';//CardFooter

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

export const PriceHistoryCard = ({ ticker }: { ticker: string }) => {

    const [startDate, setStartDate] = useState("2024-09-01");
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);

    
    // Validate dates
    const isValidDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date.getTime());
    };

    useEffect(() => {
        fetchPriceHistory();
    }, []);

    const fetchPriceHistory = useCallback(async () => {    
        if (isValidDate(startDate) && isValidDate(endDate)) {
            try {
                const response = await fetch(`/api/price-history?ticker=${ticker}&startDate=${startDate}&endDate=${endDate}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const rawData = await response.json();

                // Check if rawData is an object with a candles property
                const candles = rawData.candles || [];
                
                // Transform the data to match PriceHistory interface
                const formattedData: PriceHistory[] = candles.map((item: any, index: number) => ({
                    key: index.toString(),
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                    volume: item.volume,
                    datetime: new Date(item.datetime).toLocaleDateString(),
                    change: ((item.close - item.open) / item.open * 100).toFixed(2)
                }));

                setPriceHistory(formattedData);
            } catch (error) {
                console.error('Error fetching price history:', error);
                setPriceHistory([]);
            }
        } else {
            console.log('Invalid dates provided:', { startDate, endDate });
            setPriceHistory([]);
        }
    }, [ticker, startDate, endDate]);

    return (
      <Card className="w-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Price History for {ticker}</CardTitle>
          <CardDescription>
            {ticker} daily price history from {startDate} to {endDate}.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col">
              <label htmlFor="startDate" className="text-sm mb-1">Start Date</label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="endDate" className="text-sm mb-1">End Date</label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button onClick={() => fetchPriceHistory()} className="mt-auto">Update</Button>
          
            <DataTable columns={columns} data={priceHistory}/>
        </CardContent>
      </Card>
    );
  };