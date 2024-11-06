
import { accounts as accountsFile}  from '@/app/lib/accounts';
import Link from 'next/link';
import { getAccounts } from "@/app/getAccounts";
import { Position } from "@/app/lib/utils";
import PositionsTable from "@/app/ui/positions-table";


export default async function Page({params} : {params: {account: string}}) {

  const accountNumber = params.account;

  let accounts;
  try {
    accounts = await getAccounts();
  } catch (error) {
   console.log("Web service call failed with error: " + error)
   accounts = accountsFile;
  }


  let positions;
    for (const acc in accounts) {
      if ( accounts[acc].securitiesAccount.accountNumber == accountNumber ) {
          positions = accounts[acc].securitiesAccount.positions
          }

      }
      const formatPositions: Position[] = Object.entries(positions).map(([key, value]) => 
        ({
          key: key,
          symbol: value.instrument.symbol,
          marketValue: value.marketValue,
          averagePrice: value.averagePrice,
          longQuantity: value.longQuantity,
          longOpenProfitLoss: value.longOpenProfitLoss,
          netChange: value.instrument.netChange
        }));

    return (

      <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <header className="flex flex-col sm:items-start"> 
          <p className=" text-gray-800 md:text-2xl md:leading-normal">
             <strong>Welcome to FinanceGuy.</strong> This is the positions page.
          </p>
          
        </header>
        <main className="flex flex-col gap-8 sm:items-start">
        <p >
              <Link
              href=".."
              className="border border-slate-200 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
              >
              Go Back 
              </Link>
          </p>
          <PositionsTable positions={formatPositions} accountNumber ={accountNumber}/>
        </main>    
      </div>
    );
  }