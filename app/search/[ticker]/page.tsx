"use client";
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {Card,CardContent,CardDescription,CardHeader,CardTitle, CardFooter} from '@/app/ui/card';//CardFooter
import { Divider } from "@nextui-org/react";
import { PriceHistoryCard } from '@/app/ui/PriceHistoryCard';
import {  Suspense } from 'react';
import { getFirstBusinessDay, PriceHistory, Ticker } from '@/app/lib/utils';
import PageHeader from '@/app/components/PageHeader';
import ADRCalculationCard from '@/app/lib/adr-calculation-card';


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
/*** */
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
  const hasData = Object.keys(tickerData).length > 0;
/*** Price History ***/
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

console.log("priceHistory: " + JSON.stringify(priceHistory.slice(0, 5), null, 2));

let trueRange5 = 0;
let dailyRange5 = 0;
for (let i = 0; i < priceHistory.slice(0, 5).length; i++) {

  let highMinusLow = Math.abs(priceHistory[i].high - priceHistory[i].low);
  let highMinusPrevClose = 0;
  let lowMinusPrevClose = 0;
  if (i > 0) {
   highMinusPrevClose = Math.abs(priceHistory[i].high - priceHistory[i - 1].close);
     lowMinusPrevClose = Math.abs(priceHistory[i].low - priceHistory[i - 1].close);
  }
  let trueRange = Math.max(highMinusLow, highMinusPrevClose, lowMinusPrevClose);
  let percentRange = Math.abs((priceHistory[i].high / priceHistory[i].low - 1) * 100).toFixed(2);
  trueRange5 += trueRange;
  dailyRange5 += parseFloat(percentRange);
}
let averageTrueRange5 : number = parseFloat(formatter.format(trueRange5 / 5));
console.log("trueRange5: $" + averageTrueRange5);
let averageDailyRange5 :number = parseFloat((dailyRange5 / 5).toFixed(2));
console.log("dailyRange5: " + averageDailyRange5 + "%");
  

let trueRange20 = 0;
let dailyRange20 = 0;
for (let i = 0; i < priceHistory.slice(0, 20).length; i++) {

  let highMinusLow = Math.abs(priceHistory[i].high - priceHistory[i].low);
  let highMinusPrevClose = 0;
  let lowMinusPrevClose = 0;
  if (i > 0) {
   highMinusPrevClose = Math.abs(priceHistory[i].high - priceHistory[i - 1].close);
     lowMinusPrevClose = Math.abs(priceHistory[i].low - priceHistory[i - 1].close);
  }
  let trueRange = Math.max(highMinusLow, highMinusPrevClose, lowMinusPrevClose);
  let percentRange = Math.abs((priceHistory[i].high / priceHistory[i].low - 1) * 100).toFixed(2);
  trueRange20 += trueRange;
  dailyRange20 += parseFloat(percentRange);
}
let averageTrueRange20 : number = parseFloat(formatter.format(trueRange20 / 20));
console.log("trueRange20: $" + averageTrueRange20);
let averageDailyRange20 : number = parseFloat((dailyRange20 / 20).toFixed(2));
console.log("dailyRange20: " + averageDailyRange20 + "%");
  

  return (
    <div className="flex flex-col w-full gap-6 p-4">
      <PageHeader>
        This is the ticker page.          
      </PageHeader> 

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 w-full">
      
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{ticker} {hasData ? " $" + formatter.format(tickerData.mark) : 'N/A'}   
 
                <span style={{ color: hasData ? getColor(tickerData.netPercentChange) : 'black'}}> 
                    {hasData ? " " + formatter.format(tickerData.netPercentChange) : 'N/A'}% 
                </span>
            </CardTitle>       
            <Divider></Divider>
            <CardDescription>
              {hasData ? tickerData.description : 'Failed to load data from Charles Schwab API.'}
            </CardDescription>
          </CardHeader>
          <CardContent >
            Net Change: 
              <span style={{ color: hasData ? getColor(tickerData.netChange) : 'black'}}> 
                {hasData ? " $" + formatter.format(tickerData.netChange) : 'N/A'} 
              </span> <br></br>  
            After hours change: 
              <span style={{ color: hasData ? getColor(tickerData.postMarketChange) : 'black'}}> 
                {hasData ? " $" +formatter.format(tickerData.postMarketChange) : 'N/A'} 
            </span> <br></br>
            After hours  
              <span style={{ color: hasData ? getColor(tickerData.postMarketPercentChange) : 'black'}}> 
                {hasData ? " " + formatter.format(tickerData.postMarketPercentChange) +"%" : 'N/A'} 
              </span>    
              <br></br> 
                   Regular market price: {hasData ? formatter.format(tickerData.regularMarketLastPrice) : 'N/A'} <br></br>
              Daily volume: {hasData ? formatterVol.format(tickerData .totalVolume) : 'N/A'} <br></br>
              Regular market net change: {hasData ? formatter.format(tickerData.regularMarketNetChange) : 'N/A'} <br></br>
              Regular market % change: {hasData ? formatter.format(tickerData.regularMarketPercentChange) : 'N/A'} <br></br><br></br>
              Last close price: {hasData ? formatter.format(tickerData.closePrice) : 'N/A'} <br></br>
              Daily high: {hasData ? formatter.format(tickerData.highPrice) : 'N/A'} <br></br>
              Daily low: {hasData ? formatter.format(tickerData.lowPrice) : 'N/A'} <br></br><br></br>
                    
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
          5 Day ADR: <span style={{ color: averageDailyRange5 > 5 ? 'green' : 'red' }}>
                 {hasData ? averageDailyRange5 + "%" : 'N/A'}
            </span> <br></br>
            5 Day ATR: {hasData ? "$" + averageTrueRange5 : 'N/A'}
            <br></br>
            <br></br>
            20 Day ADR: <span style={{ color: averageDailyRange20 > 5 ? 'green' : 'red' }}>
                 {hasData ? averageDailyRange20 + "%" : 'N/A'}
            </span> <br></br>
             20 Day ATR:  {hasData ? "$" + averageTrueRange20 : 'N/A'}
             <br></br>
            <br></br>
            52 week high: {hasData ? tickerData["52WeekHigh"] : 'N/A'} <br></br>
            52 week low: {hasData ? tickerData["52WeekLow"] : 'N/A'} <br></br>
            <br></br>
            10 day average volume: {hasData ? formatterVol.format(tickerData['10DayAverageVolume']) : 'N/A'} <br></br>      
            1 year average volume: {hasData ? formatterVol.format(tickerData['1YearAverageVolume']) : 'N/A'} <br></br> 
            <br></br>
            <Divider></Divider> 
          </CardContent>
          
          <CardFooter className="text-sm text-gray-500"> 
            ADR = Average Daily Range<br></br>
            ATR = Average True Range           
          </CardFooter>
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

      
        <ADRCalculationCard price={Number(tickerData.mark)} />

        <Suspense fallback={<div>Loading price history...</div>}>
          <PriceHistoryCard ticker={ticker} />
        </Suspense>
        

      </main>    
    </div>
  );
}