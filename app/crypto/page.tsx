"use client";
import { useState, useEffect } from 'react';
import { CryptoPriceCard } from '@/app/components/CryptoPriceCard';
import { MarketOverviewCard } from '@/app/components/MarketOverviewCard';
import { CryptoListManager } from '@/app/components/CryptoListManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DEFAULT_CRYPTOS = ['BTC', 'ETH'];
const STORAGE_KEY = 'selectedCryptos';

function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CryptoPage() {
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>(DEFAULT_CRYPTOS);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved cryptocurrencies on mount
  useEffect(() => {
    const loadSavedCryptos = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedCryptos(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading saved cryptocurrencies:', error);
      } finally {
        // Add a small delay to prevent flash of loading state
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    loadSavedCryptos();
  }, []);

  // Save cryptocurrencies when changed
  const handleUpdateCryptos = (cryptos: string[]) => {
    setSelectedCryptos(cryptos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cryptos));
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between gap-2 mb-8">
        <h1 className="text-2xl font-semibold">Cryptocurrency Dashboard</h1>
      </div>

      {isLoading ? (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-9 w-36" />
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-36 rounded-full" />
          </div>
        </div>
      ) : (
        <CryptoListManager
          selectedCryptos={selectedCryptos}
          onUpdateCryptos={handleUpdateCryptos}
        />
      )}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <LoadingCard />
            <LoadingCard />
          </>
        ) : (
          selectedCryptos.map((symbol) => (
            <CryptoPriceCard key={symbol} symbol={symbol} />
          ))
        )}
      </div>

      <div className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
        <MarketOverviewCard />

        <Card>
          <CardHeader>
            <CardTitle>News & Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Cryptocurrency news and updates will be displayed here. Stay tuned for the latest market insights and analysis.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 