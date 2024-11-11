interface PriceHistory {
    key: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    datetime: string;
    change: string;
}

export const getPriceHistory = async(ticker: string, startDate: string, endDate: string) => {
    const startDateMilliseconds = new Date(startDate).getTime();
    const endDateMilliseconds = new Date(endDate).getTime();
    console.log("inside getPriceHistory...");
    const res = await fetch(`https://api.schwabapi.com/marketdata/v1/pricehistory?symbol=${ticker}&periodType=year&frequencyType=daily&startDate=${startDateMilliseconds}&endDate=${endDateMilliseconds}&needPreviousClose=false`, {
        method: 'GET',
        headers: {
          "Accept-Encoding": "application/json",
          Authorization: "Bearer " + process.env.ACCESS_TOKEN,
        },
    });

    if (!res.ok) { 
        throw new Error(`Failed to getPriceHistory from Charles Schwab API. Status: ${res.status} - ${res.statusText}`)
    }
    const data = await res.json();

    const days : PriceHistory[] = Object.entries(data.candles).map(([key, value]: [string, any]) => 
        ({

        key: key,
        open: value.open,
        high: value.high,
        low: value.low,
        close: value.close,
        volume: value.volume,
        datetime: value.datetime,
        change: (((value.close - value.open) / value.open) * 100).toFixed(2)
    }));
    return days
};