"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/app/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/app/ui/table';
import { Plus, X, Pencil, Check } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { ColumnDef } from "@tanstack/react-table";
import { Ticker } from '../lib/utils';
import Link from 'next/link';


interface WatchlistCard {
  id: string;
  name: string;
  tickers: Ticker[];
  isEditing?: boolean;
}

const STORAGE_KEY = 'watchlists';

const fetchTickerData = async (ticker: string): Promise<Ticker | null> => {
  try {
    const response = await fetch(`/api/ticker?ticker=${ticker}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ticker data for ${ticker}`);
    }
    const data = await response.json();
    return {
      key: ticker,
      symbol: ticker,
      ...data
    };
  } catch (error) {
    console.error(`Error fetching ticker data:`, error);
    return null;
  }
};

export default function WatchlistPage() {
  const [watchlists, setWatchlists] = useState<WatchlistCard[]>([]);
  const [newTickerInputs, setNewTickerInputs] = useState<{ [key: string]: string }>({});
  const [editNameInputs, setEditNameInputs] = useState<{ [key: string]: string }>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load watchlists from localStorage only on initial render
  useEffect(() => {
    if (!isInitialized) {
      const savedWatchlists = localStorage.getItem(STORAGE_KEY);
      if (savedWatchlists) {
        const parsed = JSON.parse(savedWatchlists);
        setWatchlists(parsed.map((w: WatchlistCard) => ({ ...w, isEditing: false })));
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Save watchlists to localStorage only after initialization
  useEffect(() => {
    if (isInitialized) {
      //console.log("Saving watchlists to localStorage: " + JSON.stringify(watchlists, null, 2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlists));
    }
  }, [watchlists, isInitialized]);

  const addWatchlist = () => {
    const newWatchlist: WatchlistCard = {
      id: Date.now().toString(),
      name: `Watchlist ${watchlists.length + 1}`,
      tickers: [],
      isEditing: false,
    };
    setWatchlists([...watchlists, newWatchlist]);
    setNewTickerInputs({ ...newTickerInputs, [newWatchlist.id]: '' });
    setEditNameInputs({ ...editNameInputs, [newWatchlist.id]: newWatchlist.name });
  };

  const addTickerToWatchlist = async (watchlistId: string) => {
    const ticker = newTickerInputs[watchlistId]?.toUpperCase();
    if (!ticker) return;

    // Check if ticker already exists
    const watchlist = watchlists.find(w => w.id === watchlistId);
    if (watchlist?.tickers.some(t => t.key === ticker)) return;

    // Fetch ticker data
    const tickerData = await fetchTickerData(ticker);
    if (!tickerData) return;

    setWatchlists(watchlists.map(watchlist => {
      if (watchlist.id === watchlistId) {
        return {
          ...watchlist,
          tickers: [...watchlist.tickers, tickerData],
        };
      }
      return watchlist;
    }));

    setNewTickerInputs({ ...newTickerInputs, [watchlistId]: '' });
  };

  const removeWatchlist = (watchlistId: string) => {
    setWatchlists(watchlists.filter(w => w.id !== watchlistId));
  };


  const toggleEditMode = (watchlistId: string) => {
    setWatchlists(watchlists.map(watchlist => {
      if (watchlist.id === watchlistId) {
        if (!watchlist.isEditing) {
          setEditNameInputs({ ...editNameInputs, [watchlistId]: watchlist.name });
        }
        return { ...watchlist, isEditing: !watchlist.isEditing };
      }
      return watchlist;
    }));
  };

  const saveWatchlistName = (watchlistId: string) => {
    setWatchlists(watchlists.map(watchlist => {
      if (watchlist.id === watchlistId) {
        return {
          ...watchlist,
          name: editNameInputs[watchlistId] || watchlist.name,
          isEditing: false,
        };
      }
      return watchlist;
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const removeTicker = (watchlistId: string, ticker: string) => {
    //console.log("Removing ticker:", ticker, "from watchlist:", watchlistId);
    
    setWatchlists(watchlists.map(watchlist => {
      if (watchlist.id === watchlistId) {
        const newTickers = watchlist.tickers.filter(t => t.symbol !== ticker);
        console.log("New tickers for watchlist:", newTickers);
        return {
          ...watchlist,
          tickers: newTickers
        };
      }
      return watchlist;
    }));
  };

  const createColumns = (watchlistId: string): ColumnDef<Ticker>[] => [
    {
      accessorKey: "symbol",
      header: "Symbol",
      cell: ({ row }) => (
        <Link 
          href={`/search/${row.getValue("symbol")}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {row.getValue("symbol")}
        </Link>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "mark",
      header: "Mark",
    },
    {
      accessorKey: "netChange",
      header: "Net Change",
      cell: ({ row }) => {
        const value = row.getValue("netChange") as number;
        return (
          <span className={
            value > 0 ? "text-green-600" : 
            value < 0 ? "text-red-600" : 
            "text-gray-900"
          }>
            {value.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "netPercentChange",
      header: "% Change",
      cell: ({ row }) => {
        const value = row.getValue("netPercentChange") as number;
        return (
          <span className={
            value > 0 ? "text-green-600" : 
            value < 0 ? "text-red-600" : 
            "text-gray-900"
          }>
            {value.toFixed(2)}%
          </span>
        );
      },
    },
    {
      accessorKey: "totalVolume",
      header: "Volume",
      cell: ({ row }) => {
        const value = row.getValue("totalVolume") as number;
        return new Intl.NumberFormat().format(value);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeTicker(watchlistId, row.getValue("symbol"))}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      ),
    }
  ];

  return (
    <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <PageHeader>
        This is the watchlists page.
      </PageHeader>
    
      <main className="flex flex-col gap-8">  
        <div className="p-4">
          <div className="sticky top-0 z-10 flex justify-between items-center mb-4 pb-4">
            <h1 className="text-2xl font-bold">Watchlists</h1>
            <Button onClick={addWatchlist} className="ml-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Watchlist
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {watchlists.map((watchlist) => (
              <Card key={watchlist.id} className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => removeWatchlist(watchlist.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <CardHeader className="flex flex-row items-center justify-between pr-12">
                  {watchlist.isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={editNameInputs[watchlist.id] || ''}
                        onChange={(e) => setEditNameInputs({
                          ...editNameInputs,
                          [watchlist.id]: e.target.value,
                        })}
                        onKeyDown={(e) => handleKeyPress(e, () => saveWatchlistName(watchlist.id))}
                        className="text-xl font-semibold"
                        autoFocus
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => saveWatchlistName(watchlist.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{watchlist.name}</h2>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleEditMode(watchlist.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Enter ticker"
                      value={newTickerInputs[watchlist.id] || ''}
                      onChange={(e) => setNewTickerInputs({
                        ...newTickerInputs,
                        [watchlist.id]: e.target.value,
                      })}
                      onKeyDown={(e) => handleKeyPress(e, () => addTickerToWatchlist(watchlist.id))}
                    />
                    <Button onClick={() => addTickerToWatchlist(watchlist.id)}>
                      Add Ticker
                    </Button>
                  </div>
                  <DataTable columns={createColumns(watchlist.id)} data={watchlist.tickers} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 