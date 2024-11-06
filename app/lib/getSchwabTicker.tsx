import { cache } from "react";

export const getTicker = cache( async( ticker:string) => {

    const res = await fetch("https://api.schwabapi.com/marketdata/v1/"+ticker+"/quotes", {
        method: 'GET',
        headers: {
          "Accept-Encoding": "application/json",
          Authorization: "Bearer " + process.env.ACCESS_TOKEN,
          },
        });
  
       let data = await res.json();
    return data
})