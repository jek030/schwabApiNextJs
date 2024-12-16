import { PriceHistory } from './utils';

interface RangeCalculations {
  averageTrueRange: number;
  averageDailyRange: number;
}

export const calculateRanges = (
  priceHistory: PriceHistory[], 
  days: number
): RangeCalculations => {
  let trueRange = 0;
  let dailyRange = 0;
  const historySlice = priceHistory.slice(0, days);

  for (let i = 0; i < historySlice.length; i++) {
    const highMinusLow = Math.abs(historySlice[i].high - historySlice[i].low);
    let highMinusPrevClose = 0;
    let lowMinusPrevClose = 0;

    if (i > 0) {
      highMinusPrevClose = Math.abs(historySlice[i].high - historySlice[i - 1].close);
      lowMinusPrevClose = Math.abs(historySlice[i].low - historySlice[i - 1].close);
    }

    const dailyTrueRange = Math.max(highMinusLow, highMinusPrevClose, lowMinusPrevClose);
    const percentRange = Math.abs((historySlice[i].high / historySlice[i].low - 1) * 100);
    
    trueRange += dailyTrueRange;
    dailyRange += percentRange;
  }

  return {
    averageTrueRange: Number((trueRange / days).toFixed(2)),
    averageDailyRange: Number((dailyRange / days).toFixed(2))
  };
}; 