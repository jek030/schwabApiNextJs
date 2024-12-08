"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';
import { AlertCircle } from 'lucide-react';
import { CryptoPrice } from '@/app/lib/types';

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

export const CryptoPriceCard = ({ symbol }: { symbol: string }) => {
  const [cryptoData, setCryptoData] = useState<CryptoPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/crypto/price?symbol=${symbol}`);
        
        if (!response.ok) {
          const errorData = (await response.json()) as ApiError;
          throw new Error(errorData.error || 'Failed to fetch crypto data');
        }

        const data = await response.json() as CryptoPrice;
        setCryptoData(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch crypto data');
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    // Refresh every minute
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{symbol} Price</CardTitle>
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
        <CardTitle>{symbol} Price</CardTitle>
        <CardDescription>Real-time cryptocurrency price data</CardDescription>
      </CardHeader>
      <CardContent>
        {cryptoData ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Price</span>
              <span className="text-2xl font-bold">
                {formatCurrency(cryptoData.price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">24h Change</span>
              <span className={`font-semibold ${cryptoData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(cryptoData.change24h)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">24h Volume</span>
              <span className="font-medium">
                {formatCurrency(cryptoData.volume24h, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Market Cap</span>
              <span className="font-medium">
                {formatCurrency(cryptoData.marketCap, 0)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No data available</p>
        )}
      </CardContent>
    </Card>
  );
}; 