export async function getSchwabAccounts() {
  
    const res = await fetch("https://api.schwabapi.com/trader/v1/accounts?fields=positions", {
        method: 'GET',
        headers: {
          "Accept-Encoding": "application/json",
          Authorization: "Bearer " +  process.env.ACCESS_TOKEN,
          },
        });
  
        if (!res.ok) { 
          throw new Error(`Failed to getAccounts from Charles Schwab API. Status: ${res.status } - ${res.statusText}`)
        }

      const data = await res.json();
      return data
}