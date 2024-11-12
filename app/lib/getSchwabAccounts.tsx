export async function getSchwabAccounts(): Promise<any> {
  const res = await fetch("https://api.schwabapi.com/trader/v1/accounts?fields=positions", {
      method: 'GET',
      headers: {
          "Accept-Encoding": "application/json",
          Authorization: "Bearer " + process.env.ACCESS_TOKEN,
      },
  });

  //delay for 3 seconds to load skeleton
  await new Promise((resolve) => setTimeout(resolve, 3000));

  if (!res.ok) {
      throw new Error(`Failed to getAccounts from Charles Schwab API. Status: ${res.status} - ${res.statusText}`);
  }

  return res.json();
}