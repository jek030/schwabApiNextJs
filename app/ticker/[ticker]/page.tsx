import { accounts }  from '@/app/lib/accounts';
import Link from 'next/link';

export default function Page({params} : {params: {ticker: string }}) {

    let ticker: string = params.ticker;

    //todo : web service call to schwabapi
    
  return (
    
    <div className="grid grid-rows-[20px_1fr_20px]  justify-items-left  min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-8 row-start-1  sm:items-start"> 
        <p className={` text-xl text-gray-800 md:text-2xl md:leading-normal`}>
           <strong>Welcome to FinanceGuy.</strong> This is the ticker page.
        </p>
        
      </header>

      <main className="flex flex-col gap-8 row-start-2 justify-items-center items-center sm:items-start">

          {"Ticker " + ticker} 
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/jek030"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by jek030
        </a>
      </footer>
    </div>
  );
}