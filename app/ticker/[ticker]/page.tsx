import Link from 'next/link';
import { getTicker } from '@/app/lib/getSchwabTicker';
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from '@/app/ui/card';//CardFooter
import { Divider } from "@nextui-org/react";

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
  let accounts;
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
    accounts = await getTicker(ticker);
    console.log(accounts)
 } catch (error) {
   console.log(`getTicker(${ticker}) web service call failed with error: ${error}`)
 }

    //todo : web service call to schwabapi
  const yahooURL = "https://finance.yahoo.com/quote/" + ticker
  console.log("***** " + accounts);
  return (
    
    <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      <header className="flex flex-col  sm:items-start"> 
        <p className=" text-gray-800 md:text-2xl md:leading-normal">
           <strong >Welcome to FinanceGuy.</strong> This is the ticker page.
        </p>  
        <Link
              href=".."
              className="border border-slate-200 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
              >
              Go Back 
              </Link>
      </header>
      
      <main className="grid grid-cols-2 gap-8  sm:items-start">

      <Card>
        <CardHeader>
          <CardTitle>{ticker}</CardTitle>       
          <Divider></Divider>
          <CardDescription>
            { accounts[ticker]?.reference?.description}
          </CardDescription>
        </CardHeader>
        <CardContent >
          Price: {formatter.format(accounts[ticker]?.quote?.mark) }   <br></br>    
          Net Change: <span style={{ color: getColor(accounts[ticker]?.quote?.netChange)}}> {formatter.format(accounts[ticker]?.quote?.netChange)} </span>          
        </CardContent>
        <CardContent>
          <Link className="rounded-md bg-purple-500 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-400"
           href={yahooURL} 
           target="_blank" 
           rel="noopener noreferrer">{"Yahoo Finance"}
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>       
          <Divider></Divider>       
        </CardHeader>
        <CardContent>
            52 week high: {accounts[ticker]?.quote["52WeekHigh"]} <br></br>
            52 week low: {accounts[ticker]?.quote["52WeekLow"]} <br></br>
            10 day average volume: {formatterVol.format(accounts[ticker]?.fundamental?.avg10DaysVolume)} <br></br>      
            1 year average volume: { formatterVol.format(accounts[ticker]?.fundamental?.avg1YearVolume)} <br></br>  
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fundamentals</CardTitle>       
          <Divider></Divider>       
        </CardHeader>
        <CardContent>
            P/E Ratio:<span style={{ color: getColor(accounts[ticker]?.fundamental?.peRatio)}}> {formatter.format(accounts[ticker]?.fundamental?.peRatio)} </span> <br></br>
            EPS:<span style={{ color: getColor(accounts[ticker]?.fundamental?.eps)}}> {formatter.format(accounts[ticker]?.fundamental?.eps)} </span> <br></br>
            Next ex-dividend date: {new Date(accounts[ticker]?.fundamental?.nextDivExDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}<br></br>
            Next dividend payment date: {new Date(accounts[ticker]?.fundamental?.nextDivPayDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}<br></br>
            Dividend yield: {formatter.format(accounts[ticker]?.fundamental?.divYield)}%<br></br>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily</CardTitle>       
          <Divider></Divider>       
        </CardHeader>
        <CardContent>
            Regular market price {formatter.format(accounts[ticker]?.regular?.regularMarketLastPrice)} <br></br>
            Daily volume: {formatterVol.format(accounts[ticker]?.quote?.totalVolume)} <br></br>
            Regular market net change {formatter.format(accounts[ticker]?.regular?.regularMarketNetChange)} <br></br>
            Regular market % change {formatter.format(accounts[ticker]?.regular?.regularMarketPercentChange)} <br></br><br></br>
            Last close price {formatter.format(accounts[ticker]?.quote?.closePrice)} <br></br>
            Daily high: {formatter.format(accounts[ticker]?.quote?.highPrice)} <br></br>
            Daily low: {formatter.format(accounts[ticker]?.quote?.lowPrice)} <br></br><br></br>
            Mark: {formatter.format(accounts[ticker]?.quote?.mark)} <br></br>
            Daily % change: <span style={{ color: getColor(accounts[ticker]?.quote?.netPercentChange)}}> {formatter.format(accounts[ticker]?.quote?.netPercentChange)} </span> <br></br>        
            Daily net change: <span style={{ color: getColor(accounts[ticker]?.quote?.netChange)}}> {formatter.format(accounts[ticker]?.quote?.netChange)} </span> <br></br>
            After hours change: <span style={{ color: getColor(accounts[ticker]?.quote?.postMarketChange)}}> {formatter.format(accounts[ticker]?.quote?.postMarketChange)} </span> <br></br>
            After hours % change: <span style={{ color: getColor(accounts[ticker]?.quote?.postMarketPercentChange)}}> {formatter.format(accounts[ticker]?.quote?.postMarketPercentChange)} </span> <br></br>
        </CardContent>
      </Card>     
    </main>    
    </div>
  );
}
