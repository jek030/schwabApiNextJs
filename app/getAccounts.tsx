import { cache } from "react";

export const getAccounts = cache( async() => {

    const res = await fetch("https://api.schwabapi.com/trader/v1/accounts?fields=positions", {
        method: 'GET',
        headers: {
          "Accept-Encoding": "application/json",
          Authorization: "Bearer " + "I0.b2F1dGgyLmNkYy5zY2h3YWIuY29t.RPTLZPcd_AeWnQW94vutr0B4tk6-wfAw75PmAqWNHvM@",
          },
        });
  
       let data = await res.json();
    return data
})