import { useState, useEffect } from 'react';

interface RSIResponse {
  results: {
    values: {
      timestamp: number;
      value: number;
    }[];
  };
}

export const useRSIData = (ticker: string) => {
  const [rsi, setRSI] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSI = async () => {
      if (!ticker) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/polygon/rsi?ticker=${ticker}`);
        console.log('RSI response:', response);

        if (!response.ok) {
          throw new Error('Failed to fetch RSI data');
        }

        const data: RSIResponse = await response.json();
        if (data.results?.values?.[0]) {
          setRSI(data.results.values[0].value);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch RSI');
        console.error('Error fetching RSI:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRSI();
  }, [ticker]);

  return { rsi, isLoading, error };
}; 