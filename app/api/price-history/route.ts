import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const startDateMilliseconds = new Date(startDate!).getTime();
    const endDateMilliseconds = new Date(endDate!).getTime();

    const res = await fetch(`https://api.schwabapi.com/marketdata/v1/pricehistory?symbol=${ticker}&periodType=year&frequencyType=daily&startDate=${startDateMilliseconds}&endDate=${endDateMilliseconds}&needPreviousClose=false`, {
        headers: {
            "Accept-Encoding": "application/json",
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
    });

    const data = await res.json();
    return NextResponse.json(data);
} 