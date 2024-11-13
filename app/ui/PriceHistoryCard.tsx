"use client";
import { useEffect, useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { columns } from '@/app/lib/priceHistoryColumns';
import { DataTable } from "@/app/ui/table";
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from '@/app/ui/card';//CardFooter
import { PriceHistory } from '@/app/lib/utils';

// Add this helper function at the top of the file, after imports
const getFirstBusinessDay = () => {
    const date = new Date();
    date.setDate(1); // First day of current month
    
    // Adjust for weekend
    while (date.getDay() === 0 || date.getDay() === 6) {
        date.setDate(date.getDate() + 1);
    }
    
    return date.toISOString().split('T')[0];
};

export const PriceHistoryCard = ({ ticker }: { ticker: string }) => {

    const [startDate, setStartDate] = useState(getFirstBusinessDay());
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);

    
    // Validate dates
    const isValidDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date.getTime());
    };

    

    const fetchPriceHistory = useCallback(async () => {    
        if (isValidDate(startDate) && isValidDate(endDate)) {
            try {
                const response = await fetch(`/api/price-history?ticker=${ticker}&startDate=${startDate}&endDate=${endDate}`);
                
                const formattedPriceHistory = await response.json();
                setPriceHistory(formattedPriceHistory);

            } catch (error) {
                console.error('Error fetching price history:', error);
                setPriceHistory([]);
            }
        } else {
            console.log('Invalid dates provided:', { startDate, endDate });
            setPriceHistory([]);
        }
    }, [ticker, startDate, endDate]);

    useEffect(() => {
        fetchPriceHistory();
    }, []);

    return (
      <Card className="w-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Price History for {ticker}</CardTitle>
          <CardDescription>
            {ticker} daily price history from {startDate} to {endDate}.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-row gap-4 items-end mb-4">
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
                <Button onClick={() => fetchPriceHistory()} className="h-10">Update</Button>
            </div>
            
            <DataTable columns={columns} data={priceHistory}/>
        </CardContent>
      </Card>
    );
  };