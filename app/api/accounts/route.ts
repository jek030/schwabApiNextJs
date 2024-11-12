import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch("https://api.schwabapi.com/trader/v1/accounts?fields=positions", {
            method: 'GET',
            headers: {
                "Accept-Encoding": "application/json",
                Authorization: "Bearer " + process.env.ACCESS_TOKEN,
            },
        });

        await new Promise((resolve)=> setTimeout(resolve, 3000))


        if (!res.ok) {
            throw new Error(`Failed to getAccounts from Charles Schwab API. Status: ${res.status} - ${res.statusText}`);
        }


        const interfaceData = await res.json();
        const formattedAccounts = Object.entries(interfaceData).map(([key,value]:[string,any]) => 
            ({
              key: key,
              accountNumber: value?.securitiesAccount?.accountNumber,
              roundTrips: value?.securitiesAccount?.roundTrips,
              accountValue: value?.securitiesAccount?.initialBalances?.accountValue,
              accountEquity: value?.securitiesAccount?.currentBalances?.equity,
              cashBalance: value?.securitiesAccount?.initialBalances?.cashBalance
            }));
          console.log("formattedAccounts: " + formattedAccounts);
        return NextResponse.json(formattedAccounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }
} 