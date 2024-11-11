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
    //console.log(tickerData)
 } catch (error) {
   console.log(`getTicker(${ticker}) web service call failed with error: ${error}`)
 }

    //todo : web service call to schwabapi
  const yahooURL = "https://finance.yahoo.com/quote/" + ticker
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
              { tickerData[ticker]?.reference?.description}
            </CardDescription>
          </CardHeader>
          <CardContent >
            Price: {formatter.format(tickerData[ticker]?.quote?.mark) }   <br></br>    
            Net Change: <span style={{ color: getColor(tickerData[ticker]?.quote?.netChange)}}> {formatter.format(tickerData[ticker]?.quote?.netChange)} </span>          
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
              52 week high: {tickerData[ticker]?.quote["52WeekHigh"]} <br></br>
              52 week low: {tickerData[ticker]?.quote["52WeekLow"]} <br></br>
              10 day average volume: {formatterVol.format(tickerData[ticker]?.fundamental?.avg10DaysVolume)} <br></br>      
              1 year average volume: { formatterVol.format(tickerData[ticker]?.fundamental?.avg1YearVolume)} <br></br>  
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Fundamentals</CardTitle>       
            <Divider></Divider>       
          </CardHeader>
          <CardContent>
              P/E Ratio:<span style={{ color: getColor(tickerData[ticker]?.fundamental?.peRatio)}}> {formatter.format(tickerData[ticker]?.fundamental?.peRatio)} </span> <br></br>
              EPS:<span style={{ color: getColor(tickerData[ticker]?.fundamental?.eps)}}> {formatter.format(tickerData[ticker]?.fundamental?.eps)} </span> <br></br>
              Next ex-dividend date: {new Date(tickerData[ticker]?.fundamental?.nextDivExDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}<br></br>
              Next dividend payment date: {new Date(tickerData[ticker]?.fundamental?.nextDivPayDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}<br></br>
              Dividend yield: {formatter.format(tickerData[ticker]?.fundamental?.divYield)}%<br></br>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daily</CardTitle>       
            <Divider></Divider>       
          </CardHeader>
          <CardContent>
              Regular market price {formatter.format(tickerData[ticker]?.regular?.regularMarketLastPrice)} <br></br>
              Daily volume: {formatterVol.format(tickerData[ticker]?.quote?.totalVolume)} <br></br>
              Regular market net change {formatter.format(tickerData[ticker]?.regular?.regularMarketNetChange)} <br></br>
              Regular market % change {formatter.format(tickerData[ticker]?.regular?.regularMarketPercentChange)} <br></br><br></br>
              Last close price {formatter.format(tickerData[ticker]?.quote?.closePrice)} <br></br>
              Daily high: {formatter.format(tickerData[ticker]?.quote?.highPrice)} <br></br>
              Daily low: {formatter.format(tickerData[ticker]?.quote?.lowPrice)} <br></br><br></br>
              Mark: {formatter.format(tickerData[ticker]?.quote?.mark)} <br></br>
              Daily % change: <span style={{ color: getColor(tickerData[ticker]?.quote?.netPercentChange)}}> {formatter.format(tickerData[ticker]?.quote?.netPercentChange)}% </span> <br></br>        
              Daily net change: <span style={{ color: getColor(tickerData[ticker]?.quote?.netChange)}}> {formatter.format(tickerData[ticker]?.quote?.netChange)} </span> <br></br>
              After hours change: <span style={{ color: getColor(tickerData[ticker]?.quote?.postMarketChange)}}> {formatter.format(tickerData[ticker]?.quote?.postMarketChange)} </span> <br></br>
              After hours % change: <span style={{ color: getColor(tickerData[ticker]?.quote?.postMarketPercentChange)}}> {formatter.format(tickerData[ticker]?.quote?.postMarketPercentChange)} </span> <br></br>
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
