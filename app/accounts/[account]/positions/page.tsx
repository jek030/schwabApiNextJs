
import Image from "next/image";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/table";
//import { accounts }  from '@/app/lib/accounts';
import Link from 'next/link';
import Breadcrumbs from '@/app/accounts/[account]/positions/breadcrumbs';
const axios = require("axios");

export default async function Page({params} : {params: {account: string }}) {
//let accs = accounts;
const accountNumber = params.account;
console.log("in positions: account number passed in" +  accountNumber);

const res = await axios({
  method: "GET",
  url: "https://api.schwabapi.com/trader/v1/accounts?fields=positions",
  contentType: "application/json",
  headers: {
    "Accept-Encoding": "application/json",
    Authorization: "Bearer " + "I0.b2F1dGgyLmNkYy5zY2h3YWIuY29t.fn5kDwTo8KpReIJKFTZVfiTNzwPexRyfbuFh0kDjwvg@",
  },
});
let accounts = res.data;

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

let positions: any[] = [];
  for (let acc in accounts) {
    if ( accounts[acc].securitiesAccount.accountNumber == accountNumber ) {
        positions = accounts[acc].securitiesAccount.positions
        console.log("acc number in object" +  accounts[acc].securitiesAccount.accountNumber)
        }

    }
  return (
    
    <div className="grid grid-rows-[20px_1fr_20px]  justify-items-left  min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-8 row-start-1  sm:items-start"> 
        <p className={` text-xl text-gray-800 md:text-2xl md:leading-normal`}>
           <strong>Welcome to FinanceGuy.</strong> This is the positions page.
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

      <main className="flex flex-col gap-8 row-start-2 justify-items-center items-center sm:items-start">


    

          <div>
            <table className="hidden min-w-full text-gray-900 md:table">
                  <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                      <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                        Ticker
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Market Value
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        Avg Price
                      </th>                                    
                    </tr>
                  </thead>

                  
                  <tbody className="bg-white">
                    {positions.map(pos => 

                      <tr
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">

                           
                          <Breadcrumbs
                            breadcrumbs={[

                              {
                                label: `${pos.instrument.symbol}`,
                                href: `/ticker/${pos.instrument.symbol }`,
                              },
                            ]}
      />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        ${formatter.format(pos.marketValue)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        ${formatter.format(pos.averageLongPrice.toFixed(2))}
                      </td>                                           
                    </tr>
                    )}
                  </tbody>
            </table>
                      

              
          </div>  
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