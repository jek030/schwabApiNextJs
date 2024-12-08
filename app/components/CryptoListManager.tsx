"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Available cryptocurrencies
const AVAILABLE_CRYPTOS = {
  'BTC': 'Bitcoin',
  'ETH': 'Ethereum',
  'XRP': 'Ripple',
  'ADA': 'Cardano',
  'DOT': 'Polkadot',
  'DOGE': 'Dogecoin',
  'LINK': 'Chainlink',
  'UNI': 'Uniswap',
  'MATIC': 'Polygon',
  'ATOM': 'Cosmos',
} as const;

interface CryptoListManagerProps {
  selectedCryptos: string[];
  onUpdateCryptos: (cryptos: string[]) => void;
}

export function CryptoListManager({ selectedCryptos, onUpdateCryptos }: CryptoListManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');

  const availableCryptos = Object.entries(AVAILABLE_CRYPTOS).filter(
    ([symbol]) => !selectedCryptos.includes(symbol)
  );

  const handleAddCrypto = () => {
    if (selectedCrypto && !selectedCryptos.includes(selectedCrypto)) {
      onUpdateCryptos([...selectedCryptos, selectedCrypto]);
      setSelectedCrypto('');
      setIsOpen(false);
    }
  };

  const handleRemoveCrypto = (symbol: string) => {
    onUpdateCryptos(selectedCryptos.filter(crypto => crypto !== symbol));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tracked Cryptocurrencies</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Cryptocurrency
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Cryptocurrency</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Select
                value={selectedCrypto}
                onValueChange={setSelectedCrypto}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {availableCryptos.map(([symbol, name]) => (
                    <SelectItem key={symbol} value={symbol}>
                      {name} ({symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddCrypto} disabled={!selectedCrypto}>
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedCryptos.map((symbol) => (
          <div
            key={symbol}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1"
          >
            <span className="text-sm font-medium mr-2">
              {AVAILABLE_CRYPTOS[symbol as keyof typeof AVAILABLE_CRYPTOS]} ({symbol})
            </span>
            <button
              onClick={() => handleRemoveCrypto(symbol)}
              className="text-gray-500 hover:text-red-500"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 