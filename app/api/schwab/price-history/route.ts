import { NextResponse } from 'next/server';
import { PriceHistory } from '@/app/lib/utils';
import { tokenService } from '@/app/api/schwab/tokens/schwabTokenService';
import { usePriceHistoryStore } from '@/app/lib/stores/priceHistoryStore';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Check cache first
    const store = usePriceHistoryStore.getState();
    const cachedData = store.getPriceHistory({
        ticker: ticker!,
        startDate: startDate!,
        endDate: endDate!
    });

    if (cachedData) {
        return NextResponse.json(cachedData);
    }

    // If not in cache, fetch from API
    const startDateMilliseconds = new Date(startDate!).getTime();
    const endDateMilliseconds = new Date(endDate!).getTime();

    const accessToken = await tokenService.getValidToken();

    try {
    const res = await fetch(`https://api.schwabapi.com/marketdata/v1/pricehistory?symbol=${ticker}&periodType=year&frequencyType=daily&startDate=${startDateMilliseconds}&endDate=${endDateMilliseconds}&needPreviousClose=false`, {
        headers: {
            "Accept-Encoding": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to get price history from Charles Schwab API. Status: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();
// Check if rawData is an object with a candles property
const candles = data.candles || [];
                
// Transform the data to match PriceHistory interface
const formattedData: PriceHistory[] = candles.map((item: any, index: number) => ({
    key: index.toString(),
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
    datetime: new Date(item.datetime).toLocaleDateString(),
    change: ((item.close - item.open) / item.open * 100).toFixed(2)
}));



    // Store in cache before returning
    store.setPriceHistory({
        ticker: ticker!,
        startDate: startDate!,
        endDate: endDate!
    }, formattedData);

    return NextResponse.json(formattedData);

    } catch (error) {
        console.error('Error fetching price history:', error);
        return NextResponse.json({ error: 'Failed to fetch price history' }, { status: 500 });
    }
} 