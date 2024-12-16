import { useState, useCallback, useEffect } from 'react';
import { PolygonSMAResponse } from '@/app/lib/utils';

interface SMAData {
  sma10d: number;
  sma20d: number;
  sma50d: number;
  sma20w: number;
  isAbove10d: boolean;
  isAbove20d: boolean;
  isAbove50d: boolean;
  isAbove20w: boolean;
}

export const useSMAData = (ticker: string, currentPrice: number): SMAData => {
  const [sma10d, setSma10d] = useState<number>(0);
  const [sma20d, setSma20d] = useState<number>(0);
  const [sma50d, setSma50d] = useState<number>(0);
  const [sma20w, setSma20w] = useState<number>(0);

  const fetchSMA = useCallback(async (window: number, timespan: 'day' | 'week') => {
    if (ticker) {
      try {
        const response = await fetch(`/api/polygon/indicators?ticker=${ticker}&indicator=sma&window=${window}&limit=1&timespan=${timespan}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`SMA ${window} ${timespan} Fetch Error:`, errorData);
          return 0;
        }
        
        const formattedSma: PolygonSMAResponse = await response.json();
        return formattedSma.results.values[0].value;
      } catch (error) {
        console.error(`Error fetching ${window} ${timespan} SMA:`, error);
        return 0;
      }
    }
    return 0;
  }, [ticker]);

  useEffect(() => {
    const fetchAllSMA = async () => {
      setSma10d(await fetchSMA(10, 'day'));
      setSma20d(await fetchSMA(20, 'day'));
      setSma50d(await fetchSMA(50, 'day'));
      setSma20w(await fetchSMA(20, 'week'));
    };

    fetchAllSMA();
  }, [fetchSMA]);

  return {
    sma10d,
    sma20d,
    sma50d,
    sma20w,
    isAbove10d: currentPrice > sma10d,
    isAbove20d: currentPrice > sma20d,
    isAbove50d: currentPrice > sma50d,
    isAbove20w: currentPrice > sma20w
  };
}; 