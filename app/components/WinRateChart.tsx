"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RealizedTrade } from '@/app/lib/utils';

interface WinRateChartProps {
  trades: RealizedTrade[];
}

export default function WinRateChart({ trades }: WinRateChartProps) {
  // Calculate win rate by date
  const tradesByDate = trades.reduce((acc: { [key: string]: { wins: number; total: number } }, trade) => {
    const date = new Date(trade.sellDate).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { wins: 0, total: 0 };
    }
    acc[date].total++;
    if (trade.realizedGainLoss > 0) {
      acc[date].wins++;
    }
    return acc;
  }, {});

  const chartData = Object.entries(tradesByDate).map(([date, stats]) => ({
    date,
    winRate: (stats.wins / stats.total) * 100
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Daily Win Rate</CardTitle>
        <CardDescription>Percentage of winning trades by day</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
              domain={[0, 100]}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Win Rate']}
            />
            <Bar
              dataKey="winRate"
              fill="#82ca9d"
              name="Win Rate"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 