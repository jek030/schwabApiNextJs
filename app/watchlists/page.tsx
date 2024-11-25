"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/app/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/app/ui/table';
import { ColumnDef } from "@tanstack/react-table";
import { Plus, X, Pencil, Check } from 'lucide-react';
import PageHeader from '../components/PageHeader';

interface WatchlistCard {
  id: string;
  name: string;
  tickers: string[];
  isEditing?: boolean;
}

const STORAGE_KEY = 'watchlists';

export default function WatchlistPage() {
  const [watchlists, setWatchlists] = useState<WatchlistCard[]>([]);
  const [newTickerInputs, setNewTickerInputs] = useState<{ [key: string]: string }>({});
  const [editNameInputs, setEditNameInputs] = useState<{ [key: string]: string }>({});

  // Load watchlists from localStorage on initial render
  useEffect(() => {
    const savedWatchlists = localStorage.getItem(STORAGE_KEY);
    if (savedWatchlists) {
      const parsed = JSON.parse(savedWatchlists);
      setWatchlists(parsed.map((w: WatchlistCard) => ({ ...w, isEditing: false })));
    }
  }, []);

  // Save watchlists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlists));
  }, [watchlists]);

  // Column definition for the ticker table
  const columns: ColumnDef<string>[] = [
    {
      accessorKey: "ticker",
      header: "Ticker",
      cell: ({ row }) => row.original,
    },
  ];

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

  const addTickerToWatchlist = (watchlistId: string) => {
    const ticker = newTickerInputs[watchlistId]?.toUpperCase();
    if (!ticker) return;

    setWatchlists(watchlists.map(watchlist => {
      if (watchlist.id === watchlistId) {
        // Prevent duplicate tickers
        if (watchlist.tickers.includes(ticker)) {
          return watchlist;
        }
        return {
          ...watchlist,
          tickers: [...watchlist.tickers, ticker],
        };
      }
      return watchlist;
    }));

    setNewTickerInputs({ ...newTickerInputs, [watchlistId]: '' });
  };

  const removeWatchlist = (watchlistId: string) => {
    setWatchlists(watchlists.filter(w => w.id !== watchlistId));
  };

  const removeTicker = (watchlistId: string, ticker: string) => {
    setWatchlists(watchlists.map(watchlist => {
      if (watchlist.id === watchlistId) {
        return {
          ...watchlist,
          tickers: watchlist.tickers.filter(t => t !== ticker),
        };
      }
      return watchlist;
    }));
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

  // Updated columns to include delete button
  const watchlistColumns: ColumnDef<string>[] = [
    {
      accessorKey: "ticker",
      header: "Ticker",
      cell: ({ row }) => (
        <div className="flex items-center justify-between">
          <span>{row.original}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeTicker(row.original, row.getValue("ticker"))}
            className="ml-2 p-1 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
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
                  <DataTable columns={watchlistColumns} data={watchlist.tickers} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 