import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.polygon.io/v1/indicators/rsi/${ticker}?timespan=day&window=14&series_type=close&order=desc&limit=1&apiKey=${process.env.POLYGON_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch RSI data from Polygon');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching RSI:', error);
    return NextResponse.json({ error: 'Failed to fetch RSI data' }, { status: 500 });
  }
} 