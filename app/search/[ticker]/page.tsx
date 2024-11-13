"use client";
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from '@/app/ui/card';//CardFooter
import { Divider } from "@nextui-org/react";
import { PriceHistoryCard } from '@/app/ui/PriceHistoryCard';
import { Suspense } from 'react';
import { Ticker } from '@/app/lib/utils';


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

const formatterVol = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export default function Page({params} : {params: {ticker: string }}) {
  const ticker: string = params.ticker;
  const yahooURL = "https://finance.yahoo.com/quote/" + ticker;
  const [tickerData, setTickerData] = useState<Ticker>({} as Ticker);


  const fetchTickerData = useCallback(async () => {    
          try {
              const response = await fetch(`/api/ticker?ticker=${ticker}`).then(res => res.json());
              
              //const formattedTickerData = await response.json();
              setTickerData(response);

          } catch (error) {
            console.log(`getTicker(${ticker}) web service call failed with error: ${error}`)

              setTickerData({} as Ticker);
          }

  }, [ticker]);

  useEffect(() => {
    fetchTickerData();
  }, [ticker,fetchTickerData]);

  const hasData = Object.keys(tickerData).length > 0;

  return (
    <div className="flex flex-col w-full gap-6 p-4">
      <header className="flex flex-col sm:items-start px-4">
        <p className="text-gray-800 md:text-2xl md:leading-normal">
           <strong>Welcome to FinanceGuy.</strong> This is the ticker page.
        </p>  
        <Link
          href=".."
          className="border border-slate-200 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        >
          Go Back 
        </Link>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{ticker}</CardTitle>       
            <Divider></Divider>
            <CardDescription>
              {hasData ? tickerData.description : 'Failed to load data from Charles Schwab API.'}
            </CardDescription>
          </CardHeader>
          <CardContent >
            Price: {hasData ? formatter.format(tickerData.mark) : 'N/A'}   <br></br>    
            Net Change: <span style={{ color: hasData ? getColor(tickerData.netChange) : 'black'}}> 
              {hasData ? formatter.format(tickerData.netChange) : 'N/A'} 
            </span>          
          </CardContent>
          <CardContent>
            <Link className="rounded-md bg-purple-500 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-400"
             href={yahooURL} 
             target="_blank" 
             rel="noopener noreferrer">{"Yahoo Finance"}
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>       
            <Divider></Divider>       
          </CardHeader>
          <CardContent>
              52 week high: {hasData ? tickerData["52WeekHigh"] : 'N/A'} <br></br>
              52 week low: {hasData ? tickerData["52WeekLow"] : 'N/A'} <br></br>
              10 day average volume: {hasData ? formatterVol.format(tickerData['10DayAverageVolume']) : 'N/A'} <br></br>      
              1 year average volume: {hasData ? formatterVol.format(tickerData['1YearAverageVolume']) : 'N/A'} <br></br>  
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Fundamentals</CardTitle>       
            <Divider></Divider>       
          </CardHeader>
          <CardContent>
              P/E Ratio: <span style={{ color: hasData ? getColor(tickerData.peRatio) : 'black'}}> 
                {hasData ? formatter.format(tickerData.peRatio) : 'N/A'} 
              </span> <br></br>
              EPS: <span style={{ color: hasData ? getColor(tickerData.eps) : 'black'}}> 
                {hasData ? formatter.format(tickerData.eps) : 'N/A'} 
              </span> <br></br>
              Next ex-dividend date: {hasData && tickerData?.nextDivExDate ? 
                new Date(tickerData?.nextDivExDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) 
                : ''}<br></br>
              Next dividend payment date: {hasData && tickerData.nextDivPayDate ? 
                new Date(tickerData.nextDivPayDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) 
                : ''}<br></br>
              Dividend yield: {hasData ? formatter.format(tickerData.divYield) : 'N/A'}%<br></br>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daily</CardTitle>       
            <Divider></Divider>       
          </CardHeader>
          <CardContent>
              Regular market price: {hasData ? formatter.format(tickerData.regularMarketLastPrice) : 'N/A'} <br></br>
              Daily volume: {hasData ? formatterVol.format(tickerData .totalVolume) : 'N/A'} <br></br>
              Regular market net change: {hasData ? formatter.format(tickerData.regularMarketNetChange) : 'N/A'} <br></br>
              Regular market % change: {hasData ? formatter.format(tickerData.regularMarketPercentChange) : 'N/A'} <br></br><br></br>
              Last close price: {hasData ? formatter.format(tickerData.closePrice) : 'N/A'} <br></br>
              Daily high: {hasData ? formatter.format(tickerData.highPrice) : 'N/A'} <br></br>
              Daily low: {hasData ? formatter.format(tickerData.lowPrice) : 'N/A'} <br></br><br></br>
              Mark: {hasData ? formatter.format(tickerData.mark) : 'N/A'} <br></br>
              Daily % change: <span style={{ color: hasData ? getColor(tickerData.netPercentChange) : 'black'}}> 
                {hasData ? formatter.format(tickerData.netPercentChange) : 'N/A'}% 
              </span> <br></br>        
              Daily net change: <span style={{ color: hasData ? getColor(tickerData.netChange) : 'black'}}> 
                {hasData ? formatter.format(tickerData.netChange) : 'N/A'} 
              </span> <br></br>
              After hours change: <span style={{ color: hasData ? getColor(tickerData.postMarketChange) : 'black'}}> 
                {hasData ? formatter.format(tickerData.postMarketChange) : 'N/A'} 
              </span> <br></br>
              After hours % change: <span style={{ color: hasData ? getColor(tickerData.postMarketPercentChange) : 'black'}}> 
                {hasData ? formatter.format(tickerData.postMarketPercentChange) : 'N/A'} 
              </span> <br></br>
          </CardContent>
        </Card>  
        <Suspense fallback={<div>Loading price history...</div>}>
          <PriceHistoryCard ticker={ticker} />
        </Suspense>
      </main>    
    </div>
  );
}