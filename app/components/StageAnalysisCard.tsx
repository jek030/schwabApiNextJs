import { Card, CardHeader, CardTitle, CardContent } from '@/app/ui/card';
import { Divider } from "@nextui-org/react";
import { formatter } from '@/app/lib/formatters';

interface StageAnalysisProps {
  currentPrice: number;
  smaData: {
    sma10d: number;
    sma20d: number;
    sma50d: number;
    sma20w: number;
    isAbove10d: boolean;
    isAbove20d: boolean;
    isAbove50d: boolean;
    isAbove20w: boolean;
  };
}

export function StageAnalysisCard({ currentPrice, smaData }: StageAnalysisProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stage Analysis</CardTitle>       
        <Divider />       
      </CardHeader>
      <CardContent>
        {Object.entries({
          '10 Day': { sma: smaData.sma10d, isAbove: smaData.isAbove10d },
          '20 Day': { sma: smaData.sma20d, isAbove: smaData.isAbove20d },
          '50 Day': { sma: smaData.sma50d, isAbove: smaData.isAbove50d },
          '20 Week': { sma: smaData.sma20w, isAbove: smaData.isAbove20w },
        }).map(([label, { sma, isAbove }]) => (
          <div key={label} className="py-2 border-b border-dotted border-gray-300">
            {label} SMA: <span className="font-semibold">${formatter.format(sma)}</span>
            <div className={`mt-1 mb-2 p-2 rounded-md text-white font-medium ${
              isAbove ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'
            }`}>
              {isAbove 
                ? `Above ${label} SMA ↑ (+${formatter.format((currentPrice / sma - 1) * 100)}%)` 
                : `Below ${label} SMA ↓ (-${formatter.format((1 - currentPrice / sma) * 100)}%)`
              }
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 