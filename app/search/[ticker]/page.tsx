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
  const router = useRouter();
  const ticker: string = params.ticker.toUpperCase();
  const yahooURL = "https://finance.yahoo.com/quote/" + ticker;
  const [tickerData, setTickerData] = useState<Ticker>({} as Ticker);
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
  const hasData = Object.keys(tickerData).length > 0;
/*** Price History ***/
  const [startDate, setStartDate] = useState(getFirstBusinessDay());
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [twentyDaySMAResponse, setTwentyDaySMAResponse] = useState<PolygonSMAResponse>({} as PolygonSMAResponse);
  const [sma20d, setSma20d] = useState<number>(0);
  const [sma10d, setSma10d] = useState<number>(0);
  const [sma50d, setSma50d] = useState<number>(0);
  const [sma20w, setSma20w] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

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

  
  const fetch20DaySMA = useCallback(async () => {
    if (ticker) {
      try {
        const response = await fetch(`/api/polygon/indicators?ticker=${ticker}&indicator=sma&window=20&limit=1&timespan=day`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('SMA 20 Day Fetch Error:', errorData, response.status, response.statusText);
          return;
        }
        
        const formattedSma = await response.json();
        setTwentyDaySMAResponse(formattedSma);    
        setSma20d( formattedSma.results.values[0].value);
      } catch (error) {
        console.error('Error fetching 20 Day SMA:', error);
      }
    }
  }, [ticker]);

  let blnAbove20DaySMA = false;
  if (sma20d > 0) {
    blnAbove20DaySMA = tickerData.mark > sma20d;
}

  const fetch10DaySMA = useCallback(async () => {
    if (ticker) {
      try {
        const response = await fetch(`/api/polygon/indicators?ticker=${ticker}&indicator=sma&window=10&limit=1&timespan=day`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('SMA 10 Day Fetch Error:', errorData, response.status, response.statusText);
          return;
        }
        
        const formattedSma = await response.json();
        setTwentyDaySMAResponse(formattedSma);    
        setSma10d( formattedSma.results.values[0].value);
      } catch (error) {
        console.error('Error fetching 20 Day SMA:', error);
      }
    }
  }, [ticker]);

  let blnAbove10DaySMA = false;
  if (sma10d > 0) {
    blnAbove10DaySMA = tickerData.mark > sma10d;
  }

  const fetch50DaySMA = useCallback(async () => {
    if (ticker) {
      try {
        const response = await fetch(`/api/polygon/indicators?ticker=${ticker}&indicator=sma&window=50&limit=1&timespan=day`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('SMA 50 Day Fetch Error:', errorData, response.status, response.statusText);
          return;
        }
        
        const formattedSma = await response.json();
        setTwentyDaySMAResponse(formattedSma);    
        setSma50d( formattedSma.results.values[0].value);
      } catch (error) {
        console.error('Error fetching 50 Day SMA:', error);
      }
    }
  }, [ticker]);

  let blnAbove50DaySMA = false;
  if (sma50d > 0) {
    blnAbove50DaySMA = tickerData.mark > sma50d;
  }

  const fetch20WeekSMA = useCallback(async () => {
    if (ticker) {
      try {
        const response = await fetch(`/api/polygon/indicators?ticker=${ticker}&indicator=sma&window=20&limit=1&timespan=week`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('SMA 20 Week Fetch Error:', errorData, response.status, response.statusText);
          return;
        }
        
        const formattedSma = await response.json();
        setTwentyDaySMAResponse(formattedSma);    
        setSma20w( formattedSma.results.values[0].value);
      } catch (error) {
        console.error('Error fetching 20 Week SMA:', error);
      }
    }
  }, [ticker]);

  let blnAbove20WeekSMA = false;
  if (sma20w > 0) {
    blnAbove20WeekSMA = tickerData.mark > sma20w;
  }

  useEffect(() => {
    fetchTickerData();
    fetchPriceHistory();
    fetch20DaySMA();
    fetch10DaySMA();
    fetch50DaySMA();
    fetch20WeekSMA();
  }, [ticker,fetchTickerData]);

  useEffect(() => {
    if (hasData && tickerData.mark) {
      setCurrentPrice(Number(tickerData.mark));
      console.log("Setting current price to:", tickerData.mark);
    }
  }, [hasData, tickerData]);

/*** Get SMA ***/
console.log("twentyDaySMAResponse: " + JSON.stringify(twentyDaySMAResponse, null, 2));



  



  /*** ADR Math ***/
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
//console.log("trueRange5: $" + averageTrueRange5);
let averageDailyRange5 :number = parseFloat((dailyRange5 / 5).toFixed(2));
//console.log("dailyRange5: " + averageDailyRange5 + "%");
  
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
//console.log("trueRange20: $" + averageTrueRange20);
let averageDailyRange20 : number = parseFloat((dailyRange20 / 20).toFixed(2));
//console.log("dailyRange20: " + averageDailyRange20 + "%");

  

  return (
    <div className="flex flex-col w-full gap-6 p-4">
      <PageHeader>
        This is the ticker page.          
      </PageHeader> 
      <div className=" items-center flex flex-col gap-6 px-4">

      <SearchForm />
      </div>

      <div className="flex flex-col gap-6 px-4">
        {/* 3-column grid for main cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
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
            <div className="pb-2 border-b border-dotted border-gray-300">
              Net Change: 
                <span style={{ color: hasData ? getColor(tickerData.netChange) : 'black'}}> 
                  {hasData ? " $" + formatter.format(tickerData.netChange) : 'N/A'} 
                </span>
            </div>
            <div className="py-2 border-b border-dotted border-gray-300">
              After hours change: 
                <span style={{ color: hasData ? getColor(tickerData.postMarketChange) : 'black'}}> 
                  {hasData ? " $" +formatter.format(tickerData.postMarketChange) : 'N/A'} 
              </span>
            </div>
            <div className="py-2 border-b border-dotted border-gray-300">
              After hours  
                <span style={{ color: hasData ? getColor(tickerData.postMarketPercentChange) : 'black'}}> 
                  {hasData ? " " + formatter.format(tickerData.postMarketPercentChange) +"%" : 'N/A'} 
                </span>    
            </div>
            <div className="py-2 border-b border-dotted border-gray-300">
              Regular market price: {hasData ? formatter.format(tickerData.regularMarketLastPrice) : 'N/A'}
            </div>
            <div className="py-2 border-b border-dotted border-gray-300">
              Daily volume: {hasData ? formatterVol.format(tickerData.totalVolume) : 'N/A'}
            </div>
            <div className="py-2 border-b border-dotted border-gray-300">
              Regular market net change: {hasData ? formatter.format(tickerData.regularMarketNetChange) : 'N/A'}
            </div>
            <div className="py-2 border-b border-dotted border-gray-300">
              Regular market % change: {hasData ? formatter.format(tickerData.regularMarketPercentChange) : 'N/A'}
            </div>
            <div className="py-2 border-b border-dotted border-gray-300">
              Last close price: {hasData ? formatter.format(tickerData.closePrice) : 'N/A'}
            </div>
            <div className="py-2 border-b border-dotted border-gray-300">
              Daily high: {hasData ? formatter.format(tickerData.highPrice) : 'N/A'}
            </div>
            <div className="py-2">
              Daily low: {hasData ? formatter.format(tickerData.lowPrice) : 'N/A'}
            </div>
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
            <div className="py-2 border-b border-dotted border-gray-300">
              5 Day ADR: <span style={{ color: averageDailyRange5 > 5 ? 'green' : 'red' }}>
                   {hasData ? averageDailyRange5 + "%" : 'N/A'}
              </span> <br></br>
              5 Day ATR: {hasData ? "$" + averageTrueRange5 : 'N/A'}
            </div>

            <div className="py-2 border-b border-dotted border-gray-300">
              20 Day ADR: <span style={{ color: averageDailyRange20 > 5 ? 'green' : 'red' }}>
                   {hasData ? averageDailyRange20 + "%" : 'N/A'}
              </span> <br></br>
              20 Day ATR:  {hasData ? "$" + averageTrueRange20 : 'N/A'}
            </div>

            <div className="py-2 border-b border-dotted border-gray-300">
              52 week high: {hasData ? tickerData["52WeekHigh"] : 'N/A'} <br></br>
              52 week low: {hasData ? tickerData["52WeekLow"] : 'N/A'}
            </div>

            <div className="py-2">
              10 day average volume: {hasData ? formatterVol.format(tickerData['10DayAverageVolume']) : 'N/A'} <br></br>      
              1 year average volume: {hasData ? formatterVol.format(tickerData['1YearAverageVolume']) : 'N/A'}
            </div>
          </CardContent>
          
          <CardFooter className="text-sm text-gray-500"> 
            ADR = Average Daily Range<br></br>
            ATR = Average True Range           
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Stage Analysis</CardTitle>       
            <Divider></Divider>       
          </CardHeader>
          <CardContent>
            <div className="pb-2 border-b border-dotted border-gray-300">
              10 Day SMA: <span className="font-semibold">${formatter.format(sma10d)}</span>
              <div className={`mt-1 mb-2 p-2 rounded-md text-white font-medium ${
                blnAbove10DaySMA 
                  ? 'bg-green-500 dark:bg-green-600' 
                  : 'bg-red-500 dark:bg-red-600'
              }`}>
                {blnAbove10DaySMA 
                  ? `Above 10 Day SMA ↑ (+${formatter.format((tickerData.mark / sma10d - 1) * 100)}%)` 
                  : `Below 10 Day SMA ↓ (-${formatter.format((1 - tickerData.mark / sma10d) * 100)}%)`
                }
              </div>
            </div>

            <div className="py-2 border-b border-dotted border-gray-300">
              20 Day SMA: <span className="font-semibold">${formatter.format(sma20d)}</span>
              <div className={`mt-1 mb-2 p-2 rounded-md text-white font-medium ${
                blnAbove20DaySMA 
                  ? 'bg-green-500 dark:bg-green-600' 
                  : 'bg-red-500 dark:bg-red-600'
              }`}>
                {blnAbove20DaySMA 
                  ? `Above 20 Day SMA ↑ (+${formatter.format((tickerData.mark / sma20d - 1) * 100)}%)` 
                  : `Below 20 Day SMA ↓ (-${formatter.format((1 - tickerData.mark / sma20d) * 100)}%)`
                }
              </div>
            </div>

            <div className="py-2 border-b border-dotted border-gray-300">
              50 Day SMA: <span className="font-semibold">${formatter.format(sma50d)}</span>
              <div className={`mt-1 mb-2 p-2 rounded-md text-white font-medium ${
                blnAbove50DaySMA 
                  ? 'bg-green-500 dark:bg-green-600' 
                  : 'bg-red-500 dark:bg-red-600'
              }`}>
                {blnAbove50DaySMA 
                  ? `Above 50 Day SMA ↑ (+${formatter.format((tickerData.mark / sma50d - 1) * 100)}%)` 
                  : `Below 50 Day SMA ↓ (-${formatter.format((1 - tickerData.mark / sma50d) * 100)}%)`
                }
              </div>
            </div>

            <div className="py-2">
              20 Week SMA: <span className="font-semibold">${formatter.format(sma20w)}</span>
              <div className={`mt-1 mb-2 p-2 rounded-md text-white font-medium ${
                blnAbove20WeekSMA 
                  ? 'bg-green-500 dark:bg-green-600' 
                  : 'bg-red-500 dark:bg-red-600'
              }`}>
                {blnAbove20WeekSMA 
                  ? `Above 20 Week SMA ↑ (+${formatter.format((tickerData.mark / sma20w - 1) * 100)}%)` 
                  : `Below 20 Week SMA ↓ (-${formatter.format((1 - tickerData.mark / sma20w) * 100)}%)`
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Fundamentals</CardTitle>       
            <Divider></Divider>       
          </CardHeader>
          <CardContent>
            <div className="pb-2 border-b border-dotted border-gray-300">
              P/E Ratio: <span style={{ color: hasData ? getColor(tickerData.peRatio) : 'black'}}> 
                {hasData ? formatter.format(tickerData.peRatio) : 'N/A'} 
              </span>
            </div>

            <div className="py-2 border-b border-dotted border-gray-300">
              EPS: <span style={{ color: hasData ? getColor(tickerData.eps) : 'black'}}> 
                {hasData ? formatter.format(tickerData.eps) : 'N/A'} 
              </span>
            </div>

            <div className="py-2 border-b border-dotted border-gray-300">
              Next ex-dividend date: {hasData && tickerData?.nextDivExDate ? 
                new Date(tickerData?.nextDivExDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) 
                : 'N/A'}
            </div>

            <div className="py-2 border-b border-dotted border-gray-300">
              Next dividend payment date: {hasData && tickerData.nextDivPayDate ? 
                new Date(tickerData.nextDivPayDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) 
                : 'N/A'}
            </div>

            <div className="py-2">
              Dividend yield: {hasData ? formatter.format(tickerData.divYield) : 'N/A'}%
            </div>
          </CardContent>
        </Card>
   
        <ADRCalculationCard price={hasData ? Number(tickerData.mark) : 0} />
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