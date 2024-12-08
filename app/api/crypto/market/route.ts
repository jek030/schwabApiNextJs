import { NextResponse } from 'next/server';
import { fetchWithRetry, ApiError } from '@/app/lib/api-utils';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/app/lib/cache-utils';
import { CoinGeckoMarketData, MarketData } from '@/app/lib/types';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export async function GET() {
  try {
    // Check cache first
    const cachedData = cache.get<MarketData>(CACHE_KEYS.CRYPTO_MARKET);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const data = await fetchWithRetry<CoinGeckoMarketData>(
      `${COINGECKO_API_URL}/global`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const marketData: MarketData = {
      totalMarketCap: data.data.total_market_cap.usd,
      total24hVolume: data.data.total_volume.usd,
      btcDominance: data.data.market_cap_percentage.btc,
      marketCapChangePercentage24h: data.data.market_cap_change_percentage_24h_usd
    };

    // Cache the response
    cache.set(CACHE_KEYS.CRYPTO_MARKET, marketData, { ttl: CACHE_TTL.CRYPTO_MARKET });

    return NextResponse.json(marketData);

  } catch (error) {
    console.error('Error fetching market data:', error);
    
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
} 