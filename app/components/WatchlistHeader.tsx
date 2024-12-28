import { Button } from '@/app/ui/button';
import { Plus } from 'lucide-react';

interface WatchlistHeaderProps {
  onAddWatchlist: () => void;
}

export default function WatchlistHeader({ onAddWatchlist }: WatchlistHeaderProps) {
  return (
    <div className="bg-background py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Watchlists</h1>
          <Button onClick={onAddWatchlist}>
            <Plus className="mr-2 h-4 w-4" /> Add Watchlist
          </Button>
        </div>
      </div>
    </div>
  );
} 