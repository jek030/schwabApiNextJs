import Link from 'next/link';
import { getTicker } from '@/app/lib/getSchwabTicker';
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from '@/app/ui/card';//CardFooter
import { Divider } from "@nextui-org/react";
import { Suspense } from 'react';
import EmptyDataTableSkeleton from '@/app/accounts/empty-table-skeleton';
import { columns } from '@/app/lib/positionsTableColumns';

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




export default async function Page({params} : {params: {ticker: string }}) {
  console.log("Inside search/[ticker]/page.tsx...")
  let tickerData;
  const ticker: string = params.ticker;
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
  try {
    tickerData = await getTicker(ticker);
  } catch (error) {
    console.log(`getTicker(${ticker}) web service call failed with error: ${error}`)
  }

  const yahooURL = "https://finance.yahoo.com/quote/" + ticker;
  const hasData = tickerData && tickerData[ticker];

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
              {hasData ? tickerData[ticker]?.reference?.description : 'Failed to load data from Charles Schwab API.'}
            </CardDescription>
          </CardHeader>
          <CardContent >
            Price: {hasData ? formatter.format(tickerData[ticker]?.quote?.mark) : 'N/A'}   <br></br>    
            Net Change: <span style={{ color: hasData ? getColor(tickerData[ticker]?.quote?.netChange) : 'black'}}> 
              {hasData ? formatter.format(tickerData[ticker]?.quote?.netChange) : 'N/A'} 
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
              52 week high: {hasData ? tickerData[ticker]?.quote["52WeekHigh"] : 'N/A'} <br></br>
              52 week low: {hasData ? tickerData[ticker]?.quote["52WeekLow"] : 'N/A'} <br></br>
              10 day average volume: {hasData ? formatterVol.format(tickerData[ticker]?.fundamental?.avg10DaysVolume) : 'N/A'} <br></br>      
              1 year average volume: {hasData ? formatterVol.format(tickerData[ticker]?.fundamental?.avg1YearVolume) : 'N/A'} <br></br>  
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Fundamentals</CardTitle>       
            <Divider></Divider>       
          </CardHeader>
          <CardContent>
              P/E Ratio: <span style={{ color: hasData ? getColor(tickerData[ticker]?.fundamental?.peRatio) : 'black'}}> 
                {hasData ? formatter.format(tickerData[ticker]?.fundamental?.peRatio) : 'N/A'} 
              </span> <br></br>
              EPS: <span style={{ color: hasData ? getColor(tickerData[ticker]?.fundamental?.eps) : 'black'}}> 
                {hasData ? formatter.format(tickerData[ticker]?.fundamental?.eps) : 'N/A'} 
              </span> <br></br>
              Next ex-dividend date: {hasData ? new Date(tickerData[ticker]?.fundamental?.nextDivExDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) : 'N/A'}<br></br>
              Next dividend payment date: {hasData ? new Date(tickerData[ticker]?.fundamental?.nextDivPayDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) : 'N/A'}<br></br>
              Dividend yield: {hasData ? formatter.format(tickerData[ticker]?.fundamental?.divYield) : 'N/A'}%<br></br>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daily</CardTitle>       
            <Divider></Divider>       
          </CardHeader>
          <CardContent>
              Regular market price: {hasData ? formatter.format(tickerData[ticker]?.regular?.regularMarketLastPrice) : 'N/A'} <br></br>
              Daily volume: {hasData ? formatterVol.format(tickerData[ticker]?.quote?.totalVolume) : 'N/A'} <br></br>
              Regular market net change: {hasData ? formatter.format(tickerData[ticker]?.regular?.regularMarketNetChange) : 'N/A'} <br></br>
              Regular market % change: {hasData ? formatter.format(tickerData[ticker]?.regular?.regularMarketPercentChange) : 'N/A'} <br></br><br></br>
              Last close price: {hasData ? formatter.format(tickerData[ticker]?.quote?.closePrice) : 'N/A'} <br></br>
              Daily high: {hasData ? formatter.format(tickerData[ticker]?.quote?.highPrice) : 'N/A'} <br></br>
              Daily low: {hasData ? formatter.format(tickerData[ticker]?.quote?.lowPrice) : 'N/A'} <br></br><br></br>
              Mark: {hasData ? formatter.format(tickerData[ticker]?.quote?.mark) : 'N/A'} <br></br>
              Daily % change: <span style={{ color: hasData ? getColor(tickerData[ticker]?.quote?.netPercentChange) : 'black'}}> 
                {hasData ? formatter.format(tickerData[ticker]?.quote?.netPercentChange) : 'N/A'}% 
              </span> <br></br>        
              Daily net change: <span style={{ color: hasData ? getColor(tickerData[ticker]?.quote?.netChange) : 'black'}}> 
                {hasData ? formatter.format(tickerData[ticker]?.quote?.netChange) : 'N/A'} 
              </span> <br></br>
              After hours change: <span style={{ color: hasData ? getColor(tickerData[ticker]?.quote?.postMarketChange) : 'black'}}> 
                {hasData ? formatter.format(tickerData[ticker]?.quote?.postMarketChange) : 'N/A'} 
              </span> <br></br>
              After hours % change: <span style={{ color: hasData ? getColor(tickerData[ticker]?.quote?.postMarketPercentChange) : 'black'}}> 
                {hasData ? formatter.format(tickerData[ticker]?.quote?.postMarketPercentChange) : 'N/A'} 
              </span> <br></br>
          </CardContent>
        </Card>  
        
        <Card className="w-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Additional Data</CardTitle>
            <CardDescription>
              This section will contain additional information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={EmptyDataTableSkeleton(columns)}>
              <div className="min-h-[200px] flex items-center justify-center text-gray-500">
                Future content will be loaded here
              </div>
            </Suspense>
          </CardContent>
        </Card>   
      </main>    
    </div>
  );
}
