import { Card, CardHeader, CardTitle, CardContent } from '@/app/ui/card';
import { Divider } from "@nextui-org/react";
import { Ticker } from '@/app/lib/utils';
import { safeFormat, safeFormatVol } from '@/app/lib/formatters';
import { useRSIData } from '@/app/hooks/useRSIData';
import Link from 'next/link';

interface TickerCardProps {
  ticker: Ticker;
}

export function TickerCard({ ticker }: TickerCardProps) {
  const yahooURL = `https://finance.yahoo.com/quote/${ticker.symbol}`;
  const getColor = (num: number) => num < 0 ? 'red' : num > 0 ? 'green' : 'black';
  const { rsi, isLoading: rsiLoading } = useRSIData(ticker.symbol);

  const getRSIStatus = (value: number | null) => {
    if (!value) return { color: 'black', label: 'N/A' };
    if (value >= 70) return { color: 'red', label: 'OVERBOUGHT' };
    if (value <= 30) return { color: 'green', label: 'OVERSOLD' };
    return { color: 'black', label: '' };
  };

  const rsiStatus = getRSIStatus(rsi);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {ticker.symbol} {ticker.mark ? `$${safeFormat(ticker.mark)}` : 'N/A'}
          <span style={{ color: getColor(ticker.netPercentChange) }}> 
            {!isNaN(ticker.netPercentChange) ? ` ${safeFormat(ticker.netPercentChange)}%` : ''} 
          </span>
        </CardTitle>
        <Divider />
        <div className="text-sm text-gray-500">
          {ticker.description || 'Failed to load data from Charles Schwab API.'}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="border-b border-dotted border-gray-300 pb-2">
            Volume: {safeFormatVol(ticker.totalVolume)}
          </div>
          <div className="border-b border-dotted border-gray-300 py-2">
            Day Range: ${safeFormat(ticker.lowPrice)} - ${safeFormat(ticker.highPrice)}
          </div>
          <div className="border-b border-dotted border-gray-300 py-2">
            RSI (14): {rsiLoading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              <span style={{ color: rsiStatus.color }}>
                {rsi ? `${safeFormat(rsi)} ${rsiStatus.label}` : 'N/A'}
              </span>
            )}
          </div>
          <Link 
            className="mt-4 inline-block rounded-md bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-400"
            href={yahooURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Yahoo Finance
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 