import { cache } from "react";


export const getTicker = cache( async( ticker:string) => {

    const res = await fetch("https://api.schwabapi.com/marketdata/v1/"+ticker+"/quotes", {
        method: 'GET',
        headers: {
          "Accept-Encoding": "application/json",
          Authorization: "Bearer " + "I0.b2F1dGgyLmJkYy5zY2h3YWIuY29t.RgMrgd3gjMPap_zqO4UwwT7XNrWT7QUf80pM2Zoptd4@",
          },
        });
  
       let data = await res.json();
    return data
})