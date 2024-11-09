import { DataTable } from "../ui/table";
import { Account, IAccount, IInsertAccount } from "../lib/utils";
import { getDbAccounts, insertAccount } from '../lib/database-accounts';
import { columns } from '../lib/accountsTableColumns';
import { getSchwabAccounts } from "../lib/getSchwabAccounts";


export default async function AccountsTable() {
    console.log("In function AccountsTable() in accounts-table.tsx..."); 

        let rows : IAccount[] = await getDbAccounts();
        //console.log("Rows retrieved from account query: " + rows.length)
      
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
          //console.log("\tWeb service call getAccounts()")
          formattedAccounts = Object.entries(interfaceData).map(([key,value]:[string,any]) => 
            ({
              key: key,
              accountNumber: value?.securitiesAccount?.accountNumber,
              roundTrips: value?.securitiesAccount?.roundTrips,
              accountValue: value?.securitiesAccount?.initialBalances?.accountValue,
              accountEquity: value?.securitiesAccount?.currentBalances?.equity,
              cashBalance: value?.securitiesAccount?.initialBalances?.cashBalance
            }));
      
        } catch (error) {
      
          console.log("\n***Web service call failed with error: " + error)
          formattedAccounts = databaseAccounts;
      
          /** Finally retrieved from database. If new account or new date, insert into database. */
        } finally {
      
          /**For each account from the interface, insert it into database if the timestamp. */
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
      
    return <DataTable columns={columns} data={formattedAccounts}/>
}