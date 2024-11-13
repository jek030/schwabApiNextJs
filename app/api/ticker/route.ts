import { NextResponse } from 'next/server';
import { Ticker } from '@/app/lib/utils';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    try {
        const res = await fetch("https://api.schwabapi.com/marketdata/v1/"+ticker+"/quotes", {
            method: 'GET',
            headers: {
              "Accept-Encoding": "application/json",
              Authorization: "Bearer " + process.env.ACCESS_TOKEN,
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to get ticker data from Charles Schwab API. Status: ${res.status} - ${res.statusText}`);
        }

        const interfaceData = await res.json();
        const tickerData = interfaceData[ticker!] || [];

        //console.log("tickerData: " + JSON.stringify(tickerData, null, 2));

        const formattedTickers : Ticker  = {
            key: "0",
            symbol: tickerData.symbol,
            description: tickerData.reference?.description,
            mark: tickerData.quote?.mark,
            netChange: tickerData.quote?.netChange,
            netPercentChange: tickerData .quote?.netPercentChange,
            "52WeekHigh": tickerData.quote?.["52WeekHigh"],
            "52WeekLow": tickerData.quote?.["52WeekLow"],
            "10DayAverageVolume": tickerData.fundamental?.avg10DaysVolume,
            "1YearAverageVolume": tickerData.fundamental?.avg1YearVolume,
            peRatio: tickerData.fundamental?.peRatio,
            eps: tickerData.fundamental?.eps,
            nextDivExDate: tickerData.fundamental?.nextDivExDate,
            nextDivPayDate: tickerData.fundamental?.nextDivPayDate,
            divYield: tickerData.fundamental?.divYield,
            regularMarketLastPrice: tickerData.regular?.regularMarketLastPrice,
            totalVolume: tickerData.quote?.totalVolume,
            regularMarketNetChange: tickerData.regular?.regularMarketNetChange,
            regularMarketPercentChange: tickerData.regular?.regularMarketPercentChange,
            closePrice: tickerData.quote?.closePrice,
            highPrice: tickerData.quote?.highPrice,
            lowPrice: tickerData.quote?.lowPrice,
            postMarketChange: tickerData.quote?.postMarketChange,
            postMarketPercentChange: tickerData.quote?.postMarketPercentChange
        };

        // Store the formatted accounts in the server-side cache
        return NextResponse.json(formattedTickers);

    } catch (error) {
        console.error('Error fetching ticker:', error);
        return NextResponse.json({ error: 'Failed to fetch ticker' }, { status: 500 });
    }
} 