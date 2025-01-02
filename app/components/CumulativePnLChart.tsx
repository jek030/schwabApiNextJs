"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RealizedTrade } from '@/app/lib/utils';

interface CumulativePnLChartProps {
  trades: RealizedTrade[];
}

export default function CumulativePnLChart({ trades }: CumulativePnLChartProps) {
  // Sort trades by date and calculate cumulative P&L
  const chartData = trades
    .sort((a, b) => new Date(a.sellDate).getTime() - new Date(b.sellDate).getTime())
    .reduce((acc: any[], trade) => {
      const previousValue = acc.length > 0 ? acc[acc.length - 1].cumulativePnL : 0;
      return [...acc, {
        date: new Date(trade.sellDate).toLocaleDateString(),
        pnl: trade.realizedGainLoss,
        cumulativePnL: previousValue + trade.realizedGainLoss
      }];
    }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cumulative P&L</CardTitle>
        <CardDescription>Running total of realized gains and losses</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cumulative P&L']}
            />
            <Line
              type="monotone"
              dataKey="cumulativePnL"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 