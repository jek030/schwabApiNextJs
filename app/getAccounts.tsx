import { cache } from "react";

const axios = require("axios");

export const getAccounts = cache( async() => {

    const res = await fetch("https://api.schwabapi.com/trader/v1/accounts?fields=positions", {
        method: 'GET',
        headers: {
          "Accept-Encoding": "application/json",
          Authorization: "Bearer " + "I0.b2F1dGgyLmNkYy5zY2h3YWIuY29t.Yg11Yhetz7h7TU-5DbA-r8ZXnEqBaENxSrFHn4_x--o@",
          },
        }    console.log("*** API CALL: ACCOUNTS ***");
    );
  
       let data = await res.json();
    return data
})