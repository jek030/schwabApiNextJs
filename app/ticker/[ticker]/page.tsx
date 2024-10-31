import { accounts }  from '@/app/lib/accounts';
import Link from 'next/link';
import { getAccounts } from '@/app/getAccounts';
import { getTicker } from '@/getTicker';

export default async function Page({params} : {params: {ticker: string }}) {
  let accounts;
  let ticker: string = params.ticker;
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
    console.log(accounts);
 } catch (error) {
   console.log(`getTicker(${ticker}) web service call failed with error: ${error}`)
 }

    //todo : web service call to schwabapi
  const yahooURL = "https://finance.yahoo.com/quote/" + ticker
  
  return (
    
    <div className="grid grid-rows-[20px_1fr_20px]  justify-items-left p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-2 row-start-1  sm:items-start"> 
        <p className=" text-gray-800 md:text-2xl md:leading-normal">
           <strong >Welcome to FinanceGuy.</strong>
        </p> 
        <p className=" text-gray-800 md:text-l ">
           This is the ticker page.
        </p> 
        
      </header>
      
      <main className="flex flex-col gap-8 row-start-2 justify-items-center  sm:items-start">
      <p className=" p-3 hidden h-auto w-auto grow rounded-md bg-gray-50 md:block">
        <strong className="text-xl"> {ticker} </strong> { accounts[ticker].reference.description}  <br></br>
        {formatter.format(accounts[ticker].quote.mark)}         {formatter.format(accounts[ticker].quote.netChange)} <br></br>

      </p>
      <Link className="rounded-md bg-purple-500 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-400"
           href={yahooURL}>{"Yahoo Finance"}
      </Link>


      <p className="p-3 hidden h-auto w-full grow rounded-md bg-gray-50 md:block">
        <strong>Fundamentals</strong><br></br>
        {"P/E Ratio: " + formatter.format(accounts[ticker].fundamental.peRatio)}<br></br>
        {"EPS: " + formatter.format(accounts[ticker].fundamental.eps)}<br></br>
        {"Next ex-dividend date: " + new Date(accounts[ticker].fundamental.nextDivExDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}<br></br>
        {"Next dividend payment date: " + new Date(accounts[ticker].fundamental.nextDivPayDate).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}<br></br>
        {"Dividend yield: " + formatter.format(accounts[ticker].fundamental.divYield)}%<br></br>
        {"EPS: " + formatter.format(accounts[ticker].fundamental.eps)}<br></br>
      </p>

      <p className="p-3 hidden h-auto w-full grow rounded-md bg-gray-50 md:block">
        <strong>Statistics</strong><br></br>
        {"52 week high: " + accounts[ticker].quote["52WeekHigh"]} <br></br>
        {"52 week low: " + accounts[ticker].quote["52WeekLow"]} <br></br>
        {"10 day average volume: " + formatterVol.format(accounts[ticker].fundamental.avg10DaysVolume)} <br></br>      
        {"1 year average volume: " + formatterVol.format(accounts[ticker].fundamental.avg1YearVolume)} <br></br>      
      </p>
      <p className="p-3 hidden h-auto w-full grow rounded-md bg-gray-50 md:block">
        <strong>Daily</strong><br></br>
        {"Regular market price " + formatter.format(accounts[ticker].regular.regularMarketLastPrice)} <br></br>
        {"Daily volume: " + formatterVol.format(accounts[ticker].quote.totalVolume)} <br></br>
        {"Regular market net change " + formatter.format(accounts[ticker].regular.regularMarketNetChange)} <br></br>
        {"Regular market % change " + formatter.format(accounts[ticker].regular.regularMarketPercentChange)} <br></br><br></br>
        {"Last close price " + formatter.format(accounts[ticker].quote.closePrice)} <br></br>
        {"Daily high: " + formatter.format(accounts[ticker].quote.highPrice)} <br></br>
        {"Daily low: " + formatter.format(accounts[ticker].quote.lowPrice)} <br></br><br></br>
        {"Mark: " + formatter.format(accounts[ticker].quote.mark)} <br></br>
        {"Daily % change: " + formatter.format(accounts[ticker].quote.netPercentChange)} <br></br>
        {"Daily net change: " + formatter.format(accounts[ticker].quote.netChange)} <br></br>
        {"After hours change: " + formatter.format(accounts[ticker].quote.postMarketChange)} <br></br>
        {"After hours % change: " + formatter.format(accounts[ticker].quote.postMarketPercentChange)} <br></br>
      </p>
          
          
      </main>

      
    </div>
  );
}