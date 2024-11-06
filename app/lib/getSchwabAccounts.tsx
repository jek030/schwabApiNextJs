import { cache } from "react";

export const getAccounts = cache( async() => {

    const res = await fetch("https://api.schwabapi.com/trader/v1/accounts?fields=positions", {
        method: 'GET',
        headers: {
          "Accept-Encoding": "application/json",
          Authorization: "Bearer " +  process.env.ACCESS_TOKEN,
          },
        });
  
       const data = await res.json();
    return data
})