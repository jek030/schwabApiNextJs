import { cache } from "react";

export const getAccounts = cache( async() => {

    const res = await fetch("https://api.schwabapi.com/trader/v1/accounts?fields=positions", {
        method: 'GET',
        headers: {
          "Accept-Encoding": "application/json",
          Authorization: "Bearer " + "I0.b2F1dGgyLmJkYy5zY2h3YWIuY29t.NNd9lMU2GP8tADUNTHpFFbdDu0aXocnew_EPr689LhE@",
          },
        });
  
       const data = await res.json();
    return data
})