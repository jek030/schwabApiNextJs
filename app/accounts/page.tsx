
import Image from "next/image";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/table";
import { accounts as accountsFile }  from '@/app/lib/accounts';
import Link from 'next/link';
import { getAccounts } from "../getAccounts";
import AccountTable from "../ui/accounts-table";
import { Account, Position } from "../lib/utils";

export  default async  function Page() {
  console.log("On accounts page...");

  let interfaceData
  
  try {
    interfaceData = await getAccounts();
  } catch (error) {
    console.log("Web service call failed with error: " + error)
    interfaceData = JSON.parse(accountsFile.toString());
  }

    let formatAccounts: Account[] = Object.entries(interfaceData).map(([key, value]) => 
    ({
      key: key,
      accountNumber: value.securitiesAccount.accountNumber,
      roundTrips: value.securitiesAccount.roundTrips,
      accountValue: value.securitiesAccount.initialBalances.accountValue,
      accountEquity: value.securitiesAccount.currentBalances.equity,
      cashBalance: value.securitiesAccount.initialBalances.cashBalance
    }));
      
    console.log(interfaceData)
  return (
    
    <div className="grid grid-rows-[20px_1fr_20px] p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-8 sm:items-start"> 
      <p className={` text-xl text-gray-800 md:text-2xl `}>        
           <strong>Welcome to FinanceGuy.</strong> This is the accounts page.
        </p>
    
      </header>
      <main className="flex flex-col gap-8 row-start-2 justify-items-center items-center sm:items-start">
        <p>
            <Link
            href=".."
            className="border border-slate-200 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            >
            Go Back
            </Link>
        </p>
        <AccountTable accounts={formatAccounts}/>
      </main>
    </div>
  );
}
