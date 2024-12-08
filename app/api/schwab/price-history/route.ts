import { NextResponse } from 'next/server';
import { PriceHistory } from '@/app/lib/utils';
import { tokenService } from '@/app/api/schwab/tokens/schwabTokenService';
import { usePriceHistoryStore } from '@/app/lib/stores/priceHistoryStore';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('Price history request received:', { ticker, startDate, endDate });

    if (!ticker || !startDate || !endDate) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Convert dates to UTC and validate they're not in the future
    const now = new Date();
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    // Validate dates are not in the future
    if (startDateTime > now || endDateTime > now) {
        console.error('Future dates requested:', { startDate, endDate });
        return NextResponse.json({ 
            error: 'Cannot request price history for future dates' 
        }, { status: 400 });
    }

    // Set UTC hours
    startDateTime.setUTCHours(0, 0, 0, 0);
    endDateTime.setUTCHours(23, 59, 59, 999);

    const startDateMilliseconds = startDateTime.getTime();
    const endDateMilliseconds = endDateTime.getTime();

    // Check cache first
    const store = usePriceHistoryStore.getState();
    const cachedData = store.getPriceHistory({
        ticker,
        startDate,
        endDate
    });

    if (cachedData) {
        console.log('Returning cached data for:', ticker);
        return NextResponse.json(cachedData);
    }

    const accessToken = await tokenService.getValidToken();
    console.log('Access token received:', accessToken ? 'Valid token' : 'No token');

    const apiUrl = `https://api.schwabapi.com/marketdata/v1/pricehistory?symbol=${ticker}&periodType=year&frequencyType=daily&startDate=${startDateMilliseconds}&endDate=${endDateMilliseconds}&needPreviousClose=false`;
    
    console.log('Calling Schwab API:', {
        url: apiUrl,
        params: {
            ticker,
            startDate: new Date(startDateMilliseconds).toISOString(),
            endDate: new Date(endDateMilliseconds).toISOString(),
            hasToken: !!accessToken
        }
    });

    try {
        const res = await fetch(apiUrl, {
            headers: {
                "Accept": "application/json",
                "Accept-Encoding": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Schwab API response status:', res.status);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Schwab API error response:', {
                status: res.status,
                statusText: res.statusText,
                errorText
            });
            throw new Error(`Failed to get price history. Status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Raw Schwab response:', JSON.stringify(data, null, 2));

        // Check if data has the expected structure
        if (!data || !Array.isArray(data.candles)) {
            console.error('Unexpected data structure:', JSON.stringify(data, null, 2));
            throw new Error('Invalid response format from Schwab API');
        }

        const formattedData: PriceHistory[] = data.candles.map((item: any, index: number) => ({
            key: index.toString(),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume,
            datetime: new Date(item.datetime).toISOString().split('T')[0],
            change: ((item.close - item.open) / item.open * 100).toFixed(2)
        }));

        console.log('Formatted data sample:', formattedData.slice(0, 2));

        if (formattedData.length > 0) {
            store.setPriceHistory({
                ticker,
                startDate,
                endDate
            }, formattedData);
        }

        return NextResponse.json(formattedData);

    } catch (error) {
        console.error('Error in price history route:', error);
        return NextResponse.json({ error: 'Failed to fetch price history' }, { status: 500 });
    }
} 