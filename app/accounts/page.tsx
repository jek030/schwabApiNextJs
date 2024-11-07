
import { accounts as accountsFile }  from '@/app/lib/accounts';
import Link from 'next/link';
import { getSchwabAccounts } from "../lib/getSchwabAccounts";
import AccountTable from "../ui/accounts-table";
import { Account, IAccount, IInsertAccount } from "../lib/utils";
import { getDbAccounts, insertAccount } from '../lib/database-accounts';

export default async function Page() {
  console.log("On accounts page...");
 
  
  let rows : IAccount[] = await getDbAccounts();
  console.log("Rows retrieved from account query: " + rows.length)

  let databaseAccounts: Account[]  = Object.entries(rows).map(([key,value]:[string,any]) => 
    ({
      key: key,
      accountNumber: value.accountNumber,
      roundTrips: value.roundTrips,
      accountValue: value.accountValue,
      accountEquity: value.accountEquity,
      cashBalance: value.cashBalance
    }));
    console.log("databaseAccounts.length: " + databaseAccounts.length)

  let formattedAccounts: Account[] = databaseAccounts;

  /**Try to get data from Schwab web service, if it fails use accounts from database. */
  try {
    let interfaceData = await getSchwabAccounts();
    console.log("\tWeb service call getAccounts()")

    formattedAccounts = Object.entries(interfaceData).map(([key,value]:[string,any]) => 
      ({
        key: key,
        accountNumber: value?.securitiesAccount?.accountNumber,
        roundTrips: value?.securitiesAccount?.roundTrips,
        accountValue: value?.securitiesAccount?.initialBalances?.accountValue,
        accountEquity: value?.securitiesAccount?.currentBalances?.equity,
        cashBalance: value?.securitiesAccount?.initialBalances?.cashBalance
      }));
      console.log("\tAPI call successful. formattedAccounts.length = " + formattedAccounts.length);

  } catch (error) {

    console.log("\n***Web service call failed with error: " + error)
    formattedAccounts = databaseAccounts;
    console.log("In catch - formattedAccounts.length: " + formattedAccounts.length)

    /** Finally retrieved from database. If new account or new date, insert into database. */
  } finally {

    /**For each account from the interface, insert it into database if the timestamp. */
    console.log("formattedAccounts.length: " + formattedAccounts.length)

    formattedAccounts.forEach((acc: Account ) => {

      if (rows.find(item => item.accountNumber == acc.accountNumber 
                            && new Date(item.date).toISOString().slice(0, 10) == new Date().toISOString().slice(0, 10)))  {
        console.log(acc.accountNumber + " is already in the database. No insertion.")
                            
      } else if (acc.accountNumber === undefined) {
        console.log("\n acc.accountNumber is undefined...")

      } else {
        
        try {
          console.log("\nTrying to insert account " + acc.accountNumber, acc.cashBalance)
          const newAccount: IInsertAccount = {
            accountNumber: acc.accountNumber, 
            accountValue: acc.accountValue, 
            accountEquity: acc.accountEquity, 
            roundTrips: acc.roundTrips, 
            cashBalance:acc.cashBalance, 
            date: new Date().toISOString().slice(0, 10)
          };
        
          const insertId = insertAccount(newAccount);
          console.log(`New user inserted with ID: ${insertId}`);
        
        } catch (error) {
          console.error('Error inserting account :', error);
        }
      } 
    });
  }
      
  return (
    
    <div className="grid grid-rows-[20px_1fr_20px] p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-8 sm:items-start"> 
      <p className={`text-xl text-gray-800 md:text-2xl `}>        
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
        <AccountTable accounts={formattedAccounts}/>
      </main>
    </div>
  );
}
