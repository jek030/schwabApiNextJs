import { cache } from "react";


export const getTicker = cache( async( ticker:string) => {

    const res = await fetch("https://api.schwabapi.com/marketdata/v1/"+ticker+"/quotes", {
        method: 'GET',
        headers: {
          "Accept-Encoding": "application/json",
          Authorization: "Bearer " + "I0.b2F1dGgyLmJkYy5zY2h3YWIuY29t.NNd9lMU2GP8tADUNTHpFFbdDu0aXocnew_EPr689LhE@",
          },
        });
  
       let data = await res.json();
    return data
})