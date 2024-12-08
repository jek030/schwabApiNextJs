"use client";
import { useEffect, useState, useCallback } from 'react';
import { Input } from "@/app/ui/input";
import { Button } from "@/app/ui/button";
import { columns } from '@/app/lib/priceHistoryColumns';
import { DataTable } from "@/app/ui/table";
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from '@/app/ui/card';//CardFooter
import { getFirstBusinessDay, PriceHistory } from '@/app/lib/utils';
import TradingViewChart from '@/app/components/TradingViewChart';

export const PriceHistoryCard = ({ ticker }: { ticker: string }) => {
    // Get a date 3 months ago for the start date
    const getDefaultStartDate = () => {
        const date = new Date();
        date.setMonth(date.getMonth() - 3);
        return date.toISOString().split('T')[0];
    };

    // Get current date for end date
    const getDefaultEndDate = () => {
        const date = new Date();
        return date.toISOString().split('T')[0];
    };

    const [startDate, setStartDate] = useState(getDefaultStartDate());
    const [endDate, setEndDate] = useState(getDefaultEndDate());
    const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Validate dates
    const isValidDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date.getTime());
    };

    const fetchPriceHistory = useCallback(async () => {    
        if (isValidDate(startDate) && isValidDate(endDate)) {
            // Check if start date is before end date
            if (new Date(startDate) > new Date(endDate)) {
                setError('Start date must be before end date');
                return;
            }

            // Check if date range is not more than 1 year
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            if (new Date(startDate) < oneYearAgo) {
                setError('Date range cannot exceed 1 year');
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                console.log('Fetching price history for:', {
                    ticker,
                    startDate,
                    endDate
                });
                
                const response = await fetch(`/api/schwab/price-history?ticker=${ticker}&startDate=${startDate}&endDate=${endDate}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const formattedPriceHistory = await response.json();
                console.log('Raw API response:', formattedPriceHistory);
                
                if (!Array.isArray(formattedPriceHistory)) {
                    throw new Error('Expected array of price history data but received: ' + typeof formattedPriceHistory);
                }
                
                const sortedPriceHistory = formattedPriceHistory.sort((a: PriceHistory, b: PriceHistory) => 
                    new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
                );
                
                console.log('Processed price history:', {
                    length: sortedPriceHistory.length,
                    firstItem: sortedPriceHistory[0],
                    lastItem: sortedPriceHistory[sortedPriceHistory.length - 1]
                });
                
                setPriceHistory(sortedPriceHistory);

            } catch (error) {
                console.error('Error fetching price history:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch price history');
                setPriceHistory([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            setError('Invalid dates provided');
            console.log('Invalid dates provided:', { startDate, endDate });
            setPriceHistory([]);
        }
    }, [ticker, startDate, endDate]);

    useEffect(() => {
        if (ticker && startDate && endDate) {
            fetchPriceHistory();
        }
    }, [ticker, startDate, endDate, fetchPriceHistory]);

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
        </CardContent>
        <CardContent>
            {isLoading && <div>Loading chart data...</div>}
            {error && <div className="text-red-500">Error: {error}</div>}
            {!isLoading && !error && priceHistory.length > 0 && (
                <TradingViewChart priceHistory={priceHistory} />
            )}
        </CardContent>
        <CardContent>
            {!isLoading && !error && (
                <DataTable columns={columns} data={priceHistory}/>
            )}
        </CardContent>
      </Card>
    );
  };