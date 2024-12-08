interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
}

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number = 60000; // 1 minute default TTL

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.defaultTTL;
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
    });
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const cache = Cache.getInstance();

// Cache keys
export const CACHE_KEYS = {
  CRYPTO_PRICE: (symbol: string) => `crypto_price_${symbol}`,
  CRYPTO_MARKET: 'crypto_market',
} as const;

// Cache TTLs
export const CACHE_TTL = {
  CRYPTO_PRICE: 30000,    // 30 seconds for individual prices
  CRYPTO_MARKET: 60000,   // 1 minute for market overview
} as const; 