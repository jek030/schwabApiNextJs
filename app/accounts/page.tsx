import Image from "next/image";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/table";
import { accounts as accountsFile }  from '@/app/lib/accounts';
import Link from 'next/link';
import { getAccounts } from "../getAccounts";

export  default async function Page() {

  let accounts;
  
  try {
     accounts = await getAccounts();
  } catch (error) {
    console.log("Web service call failed with error: " + error)
    accounts = accountsFile;
  }

  const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

  return (
    
    <div className="grid grid-rows-[20px_1fr_20px]  justify-items-left min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-8 row-start-1  sm:items-start"> 
        <p className={` text-xl text-gray-800 md:text-2xl md:leading-normal`}>
           
           <strong>Welcome to FinanceGuy.</strong> This is the accounts page.
           
        </p>
        <p >
            <Link
            href=".."
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            >
            Go Back
            </Link>
        </p>
      </header>


        <div>
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
              <tbody className="bg-white">
                {accounts.map(item => (
                  <tr
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">                    
                         
                        <Link className="mt-4 rounded-md bg-green-500 px-4 py-2 text-sm text-black transition-colors hover:bg-blue-400" 
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
