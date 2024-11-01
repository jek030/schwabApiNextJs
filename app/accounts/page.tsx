
import Image from "next/image";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/table";
import { accounts as accountsFile }  from '@/app/lib/accounts';
import Link from 'next/link';
import { getAccounts } from "../getAccounts";
import AccountTable from "../ui/accounts-table";
import { Account } from "../lib/Account";

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
      equity: value.securitiesAccount.currentBalances.equity,
      cashBalance: value.securitiesAccount.initialBalances.cashBalance
    }));
      


 const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
  return (
    
    <div className="grid grid-rows-[20px_1fr_20px] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-8 sm:items-start"> 
      <p className={` text-xl text-gray-800 md:text-2xl `}>        
           <strong>Welcome to FinanceGuy.</strong> This is the accounts page.
        </p>
        <p >
            <Link
            href=".."
            className="border border-black mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            >
            Go Back
            </Link>
        </p>
      </header>



        <div className="flex flex-col gap-8 ">

        <AccountTable accounts={formatAccounts}/>




        <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Account Number
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Account Value
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Account Equity
                  </th>  
                  <th scope="col" className="px-3 py-5 font-medium">
                    # of Round Trips
                  </th>  
                  <th scope="col" className="px-3 py-5 font-medium">
                    Cash Balance
                  </th>                                    
                </tr>
              </thead>
              <tbody className="bg-white ">
                {interfaceData.map(item => (
                  <tr
                  className="w-full border border-slate-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className=" flex  gap-3">                    
                         
                        <Link className="border border-black mt-4 rounded-md bg-green-500 px-4 py-2 text-sm text-black transition-colors hover:bg-blue-400" 
                              href={{pathname: `/accounts/${item.securitiesAccount.accountNumber}/positions`}}>
                                      {item.securitiesAccount.accountNumber}
                        </Link>

                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {item.securitiesAccount.initialBalances.accountValue}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    ${formatter.format(item.securitiesAccount.currentBalances.equity)}
                  </td>  
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {item.securitiesAccount.roundTrips}
                  </td>  
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    ${formatter.format(item.securitiesAccount.initialBalances.cashBalance)}
                  </td>                                           
                </tr>
                ))}

              </tbody>
            </table>
          </div>      
    </div>
  );
}
