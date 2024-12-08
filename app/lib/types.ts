export interface CoinGeckoMarketData {
  data: {
    total_market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap_percentage: {
      btc: number;
    };
    market_cap_change_percentage_24h_usd: number;
  };
}

export interface CoinGeckoCoinData {
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    total_volume: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
  };
}

export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export interface MarketData {
  totalMarketCap: number;
  total24hVolume: number;
  btcDominance: number;
  marketCapChangePercentage24h: number;
} 