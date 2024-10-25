import Image from "next/image";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/table";
import { accounts }  from './lib/accounts';
import Link from 'next/link';

export default function Home() {

  return (
    
    <div className="grid grid-rows-[20px_1fr_20px]  justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-8 row-start-1  sm:items-start"> 
        <p className={` text-xl text-gray-800 md:text-2xl md:leading-normal`}>
           <strong>Welcome to FinanceGuy.</strong> This is the homescreen.
        </p>
      </header>

      <main className="flex flex-col gap-8 row-start-2 justify-items-center items-center sm:items-start">

      
        <strong className={` text-xl text-gray-800 md:text-2xl md:leading-normal`}>
             Here is the TODO list:
        </strong> 
          <ul className="list-inside list-decimal text-center sm:text-left font-[family-name:var(--font-geist-mono)]">   
            <li>get more account information for the accounts</li>
            <li>add more fields for the tickers, link yahoo finance site</li>
            <li>Figure out how to not do 2 api calls on accounts and ticker page</li>
            <li>do I add a database?</li>

          </ul>
        <p className={` text-xl text-gray-800 md:text-2xl md:leading-normal`}>
           <Link href="/accounts"
                 className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
           >
            Click here to view your accounts.
          </Link>     
        </p>
         
      </main>

      
    </div>
  );
}
