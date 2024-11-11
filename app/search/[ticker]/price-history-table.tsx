import { DataTable } from "@/app/ui/table";
import { columns } from '@/app/lib/priceHistoryColumns';
import { getPriceHistory } from '@/app/lib/getSchwabPriceHistory';

export default async function PriceHistoryTable( ticker:string, startDate:string, endDate:string ) {
    let priceHistory;
    try {
        priceHistory = await getPriceHistory(ticker, startDate, endDate);
      } catch (error) {
        console.log(`getTicker(${ticker}) web service call failed with error: ${error}`)
      }
    
     // console.log("priceHistory: " + JSON.stringify(priceHistory,null,2));
     
        let days: any[] = [];
        if (priceHistory !== null && priceHistory !== undefined) {
         days = Object.entries(priceHistory?.candles).map(([key,value]:[string,any]) => 
          ({
            key: key,
            open: value.open,
            high: value.high,
            low: value.low,
            close: value.close,
            volume: value.volume,
            datetime: value.datetime,
            change: (((value.close - value.open) / value.open) * 100) .toFixed(2)
          }));
        }
        //console.log("days: " + JSON.stringify(days,null,2));

    return <DataTable columns={columns} data={days}/>
}