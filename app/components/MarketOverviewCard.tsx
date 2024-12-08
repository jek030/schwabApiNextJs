"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';
import { AlertCircle } from 'lucide-react';
import { MarketData } from '@/app/lib/types';

const formatCurrency = (value: number | undefined, decimals: number = 2): string => {
  if (value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

const formatPercentage = (value: number | undefined): string => {
  if (value === undefined) return 'N/A';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

interface ApiError {
  error: string;
}

export const MarketOverviewCard = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/crypto/market');
        
        if (!response.ok) {
          const errorData = (await response.json()) as ApiError;
          throw new Error(errorData.error || 'Failed to fetch market data');
        }

        const data = await response.json() as MarketData;
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch market data');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Global Market Cap</span>
            <div className="text-right">
              <span className="font-medium">
                {formatCurrency(marketData?.totalMarketCap, 0)}
              </span>
              {marketData && (
                <span className={`ml-2 text-sm ${marketData.marketCapChangePercentage24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(marketData.marketCapChangePercentage24h)}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">24h Volume</span>
            <span className="font-medium">
              {formatCurrency(marketData?.total24hVolume, 0)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">BTC Dominance</span>
            <span className="font-medium">
              {marketData?.btcDominance ? formatPercentage(marketData.btcDominance) : 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 