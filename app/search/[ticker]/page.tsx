"use client";
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {Card,CardContent,CardDescription,CardHeader,CardTitle, CardFooter} from '@/app/ui/card';//CardFooter
import { Divider } from "@nextui-org/react";
import { PriceHistoryCard } from '@/app/components/PriceHistoryCard';
import {  Suspense } from 'react';
import { getFirstBusinessDay, PriceHistory, Ticker } from '@/app/lib/utils';
import PageHeader from '@/app/components/PageHeader';
import ADRCalculationCard from '@/app/components/adr-calculation-card';
import { PolygonSMAResponse } from '@/app/lib/utils';
import SearchForm from '@/app/components/search-form';
import { useRouter } from "next/navigation";
import { useSMAData } from '@/app/hooks/useSMAData';
import { StatisticsCard } from '@/app/components/StatisticsCard';
import { StageAnalysisCard } from '@/app/components/StageAnalysisCard';
import { FundamentalsCard } from '@/app/components/FundamentalsCard';
import { TickerCard } from '@/app/components/TickerCard';

const getColor = (num:number) => {
  if(num < 0 ) {
     return 'red';
  }
  else if (num > 0) { 
    return 'green'; 
  }
  else {
     return 'black';
  }
};

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// Add a safe formatting function to handle NaN and undefined values
const safeFormat = (value: number | undefined) => {
  if (value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return formatter.format(value);
};

const formatterVol = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

// Add a safe volume formatting function
const safeFormatVol = (value: number | undefined) => {
  if (value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return formatterVol.format(value);
};
/*** */
export default function Page({params} : {params: {ticker: string }}) {
  const router = useRouter();
  const ticker: string = params.ticker.toUpperCase();
  const yahooURL = "https://finance.yahoo.com/quote/" + ticker;
  const [tickerData, setTickerData] = useState<Ticker>({} as Ticker);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [startDate, setStartDate] = useState(getFirstBusinessDay());
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const smaData = useSMAData(ticker, currentPrice);

  const fetchTickerData = useCallback(async () => {    
          try {
              const response = await fetch(`/api/schwab/ticker?ticker=${ticker}`).then(res => res.json());
              
              //const formattedTickerData = await response.json();
              setTickerData(response);

          } catch (error) {
            console.log(`getTicker(${ticker}) web service call failed with error: ${error}`)

              setTickerData({} as Ticker);
          }

  }, [ticker]);

  // Validate dates
  const isValidDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date instanceof Date && !isNaN(date.getTime());
  };
 
  const fetchPriceHistory = useCallback(async () => {    
      if (isValidDate(startDate) && isValidDate(endDate)) {
          try {
              const response = await fetch(`/api/schwab/price-history?ticker=${ticker}&startDate=${startDate}&endDate=${endDate}`);
              
              const formattedPriceHistory = await response.json();
              // Sort priceHistory by change date descending
              const sortedPriceHistory = formattedPriceHistory.sort((a: PriceHistory, b: PriceHistory) => 
                  new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
              );
              setPriceHistory(sortedPriceHistory);

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
    fetchTickerData();
    fetchPriceHistory();
  }, [ticker,fetchTickerData]);

  useEffect(() => {
    if (tickerData.mark) {
      setCurrentPrice(Number(tickerData.mark));
      console.log("Setting current price to:", tickerData.mark);
    }
  }, [tickerData]);

  return (
    <div className="flex flex-col w-full gap-2">
      <PageHeader>
        This is the ticker page.          
      </PageHeader> 
      <div className=" items-center flex flex-col">
        <SearchForm />    
      </div>

      <div className="flex flex-col gap-2">
        {/* 3-column grid for main cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 w-full">
          <TickerCard ticker={tickerData} />
          <StatisticsCard ticker={tickerData} priceHistory={priceHistory} />
          <StageAnalysisCard 
            currentPrice={currentPrice} 
            smaData={smaData} 
          />
          <FundamentalsCard ticker={tickerData} />
          <ADRCalculationCard price={currentPrice} />
        </div>

        {/* Price History Card in full width */}
        <div className="w-full">
          <Suspense fallback={<div>Loading price history...</div>}>
            <PriceHistoryCard ticker={ticker} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}