import { create } from 'zustand';
import { PriceHistory } from '@/app/lib/utils';

interface CacheKey {
  ticker: string;
  startDate: string;
  endDate: string;
}

interface CacheEntry {
  data: PriceHistory[];
  timestamp: number;
}

interface PriceHistoryStore {
  cache: Map<string, CacheEntry>;
  getPriceHistory: (key: CacheKey) => PriceHistory[] | null;
  setPriceHistory: (key: CacheKey, data: PriceHistory[]) => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const createCacheKey = (key: CacheKey): string => {
  return `${key.ticker}-${key.startDate}-${key.endDate}`;
};

export const usePriceHistoryStore = create<PriceHistoryStore>((set, get) => ({
  cache: new Map(),
  
  getPriceHistory: (key: CacheKey) => {
    const cacheKey = createCacheKey(key);
    const entry = get().cache.get(cacheKey);
    
    if (!entry) return null;
    
    // Check if cache is expired
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
        console.log("Cache expired for " + key.ticker);
      get().cache.delete(cacheKey);
      return null;
    }
    console.log("Cache hit for " + key.ticker);
    return entry.data;
  },
  
  setPriceHistory: (key: CacheKey, data: PriceHistory[]) => {
    const cacheKey = createCacheKey(key);
    set((state) => ({
      cache: new Map(state.cache).set(cacheKey, {
        data,
        timestamp: Date.now(),
      }),
    }));
  },
})); 