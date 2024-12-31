"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';

interface RealizedTrade {
  symbol: string;
  realizedGainLoss: number;
  percentageGain: number;
}

interface SymbolAnalytics {
  symbol: string;
  totalTrades: number;
  avgGainLoss: number;
  avgPercentageGain: number;
  totalGainLoss: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
}

export default function RealizedTradesAnalytics({ trades }: { trades: RealizedTrade[] }) {
  // Calculate analytics per symbol
  const analytics: { [key: string]: SymbolAnalytics } = {};
  
  trades.forEach(trade => {
    if (!analytics[trade.symbol]) {
      analytics[trade.symbol] = {
        symbol: trade.symbol,
        totalTrades: 0,
        avgGainLoss: 0,
        avgPercentageGain: 0,
        totalGainLoss: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0
      };
    }
    
    analytics[trade.symbol].totalTrades++;
    analytics[trade.symbol].totalGainLoss += trade.realizedGainLoss;
    analytics[trade.symbol].avgGainLoss = analytics[trade.symbol].totalGainLoss / analytics[trade.symbol].totalTrades;
    analytics[trade.symbol].avgPercentageGain = (analytics[trade.symbol].avgPercentageGain * (analytics[trade.symbol].totalTrades - 1) + trade.percentageGain) / analytics[trade.symbol].totalTrades;
    
    if (trade.realizedGainLoss > 0) {
      analytics[trade.symbol].winningTrades++;
    } else {
      analytics[trade.symbol].losingTrades++;
    }
    analytics[trade.symbol].winRate = (analytics[trade.symbol].winningTrades / analytics[trade.symbol].totalTrades) * 100;
  });

  // Calculate overall statistics
  const totalTrades = trades.length;
  const totalGainLoss = trades.reduce((sum, trade) => sum + trade.realizedGainLoss, 0);
  const avgGainLoss = totalGainLoss / totalTrades;
  const winningTrades = trades.filter(t => t.realizedGainLoss > 0).length;
  const overallWinRate = (winningTrades / totalTrades) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Overall Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Trades</p>
                <p className="text-lg font-medium">{totalTrades}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total P/L</p>
                <p className={`text-lg font-medium ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalGainLoss.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average P/L per Trade</p>
                <p className={`text-lg font-medium ${avgGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${avgGainLoss.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Win Rate</p>
                <p className="text-lg font-medium">{overallWinRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Per Symbol Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Symbol Breakdown</h3>
            <div className="space-y-4">
              {Object.values(analytics).sort((a, b) => b.totalTrades - a.totalTrades).map(stat => (
                <div key={stat.symbol} className="border-b pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{stat.symbol}</span>
                    <span className="text-sm">{stat.totalTrades} trades</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Avg P/L</p>
                      <p className={stat.avgGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${stat.avgGainLoss.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Win Rate</p>
                      <p>{stat.winRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total P/L</p>
                      <p className={stat.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${stat.totalGainLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 