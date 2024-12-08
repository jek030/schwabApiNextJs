import { NextResponse } from 'next/server';
import { fetchWithRetry, ApiError } from '@/app/lib/api-utils';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/app/lib/cache-utils';
import { CoinGeckoCoinData, CryptoPrice } from '@/app/lib/types';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Map of our symbols to CoinGecko IDs
const CRYPTO_ID_MAP: { [key: string]: string } = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'DOT': 'polkadot',
  'DOGE': 'dogecoin',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'MATIC': 'matic-network',
  'ATOM': 'cosmos'
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      throw new ApiError('Symbol parameter is required', 400);
    }

    const coinId = CRYPTO_ID_MAP[symbol.toUpperCase()];
    if (!coinId) {
      throw new ApiError('Unsupported cryptocurrency symbol', 400);
    }

    // Check cache first
    const cacheKey = CACHE_KEYS.CRYPTO_PRICE(symbol);
    const cachedData = cache.get<CryptoPrice>(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const data = await fetchWithRetry<CoinGeckoCoinData>(
      `${COINGECKO_API_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const priceData: CryptoPrice = {
      symbol: symbol.toUpperCase(),
      price: data.market_data.current_price.usd,
      change24h: data.market_data.price_change_percentage_24h,
      volume24h: data.market_data.total_volume.usd,
      marketCap: data.market_data.market_cap.usd,
    };

    // Cache the response
    cache.set(cacheKey, priceData, { ttl: CACHE_TTL.CRYPTO_PRICE });

    return NextResponse.json(priceData);

  } catch (error) {
    console.error('Error fetching crypto data:', error);
    
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
} 