import { cache } from "react";

export const getPriceHistory = cache( async( ticker:string, startDate:string, endDate:string) => {

    const startDateMilliseconds = new Date(startDate).getTime();
    const endDateMilliseconds = new Date(endDate).getTime();

    const res = await fetch(`https://api.schwabapi.com/marketdata/v1/pricehistory?symbol=${ticker}&periodType=year&frequencyType=daily&startDate=${startDateMilliseconds}&endDate=${endDateMilliseconds}&needPreviousClose=false`, {
        method: 'GET',
        headers: {
          "Accept-Encoding": "application/json",
          Authorization: "Bearer " + process.env.ACCESS_TOKEN,
          },
        });

        if (!res.ok) { 
          throw new Error(`Failed to getPriceHistory from Charles Schwab API. Status: ${res.status } - ${res.statusText}`)
        }
      const data = await res.json();
      return data
})