"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface Position {
  symbol: string;
  marketValue: number;
  [key: string]: any;
}

interface PositionsPieChartProps {
  positions: Position[];
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FDB462', '#B3DE69', '#FCCDE5', '#BC80BD'
];

export default function PositionsPieChart({ positions }: PositionsPieChartProps) {
  const data = positions.map(position => ({
    name: position.symbol,
    value: position.marketValue
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Portfolio Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[600px] flex justify-center">
          <PieChart width={600} height={600}>
            <Pie
              data={data}
              cx="50%"
              cy="40%"
              labelLine={{ strokeWidth: 1, length: 20 }}
              label={({ name, percent }) => 
                `${name} (${(percent * 100).toFixed(1)}%)`
              }
              outerRadius={160}
              innerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => 
                `$${value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
              }
            />
            <Legend 
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: "40px" }}
            />
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
} 