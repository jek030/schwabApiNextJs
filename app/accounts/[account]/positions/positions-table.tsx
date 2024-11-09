import { DataTable } from "@/app/ui/table";
import { accounts as accountsFile}  from '@/app/lib/accounts';
import { columns } from '@/app/lib/positionsTableColumns';
import { getSchwabAccounts } from "@/app/lib/getSchwabAccounts";
import { Position } from "@/app/lib/utils";


export default async function PositionsTable(accountNum:string) {
    let accounts;
    //Using try to catch web service ffailure into the file.
    try {
      accounts = await getSchwabAccounts();
    } catch (error) {
     console.log("Web service call failed with error: " + error)
     accounts = accountsFile;
    }
  
  
    let positions;
      for (const acc in accounts) {
        if ( accounts[acc]?.securitiesAccount?.accountNumber == accountNum) {
            console.log("In if" + accountNum);
            console.log(accounts[acc]?.securitiesAccount?.positions);
            positions = accounts[acc]?.securitiesAccount?.positions
            }
  
        }
        let formatPositions: Position[] = [];
        if (positions !== null && positions !== undefined) {
         formatPositions = Object.entries(positions).map(([key,value]:[string,any]) => 
          ({
            key: key,
            symbol: value.instrument.symbol,
            marketValue: value.marketValue,
            averagePrice: value.averagePrice,
            longQuantity: value.longQuantity,
            longOpenProfitLoss: value.longOpenProfitLoss,
            netChange: value.instrument.netChange
          }));
        }

    return <DataTable columns={columns} data={formatPositions}/>
}