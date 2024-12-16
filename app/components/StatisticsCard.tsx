import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/app/ui/card';
import { Divider } from "@nextui-org/react";
import { PriceHistory, Ticker } from '@/app/lib/utils';
import { calculateRanges } from '@/app/lib/priceCalculations';
import { safeFormat, safeFormatVol } from '@/app/lib/formatters';

interface StatisticsCardProps {
  ticker: Ticker;
  priceHistory: PriceHistory[];
}

export function StatisticsCard({ ticker, priceHistory }: StatisticsCardProps) {
  const range5Day = calculateRanges(priceHistory, 5);
  const range20Day = calculateRanges(priceHistory, 20);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Statistics</CardTitle>       
        <Divider />       
      </CardHeader>
      <CardContent>
        <div className="py-2 border-b border-dotted border-gray-300">
          5 Day ADR: <span style={{ color: range5Day.averageDailyRange > 5 ? 'green' : 'red' }}>
            {range5Day.averageDailyRange}%
          </span> <br />
          5 Day ATR: ${safeFormat(range5Day.averageTrueRange)}
        </div>

        <div className="py-2 border-b border-dotted border-gray-300">
          20 Day ADR: <span style={{ color: range20Day.averageDailyRange > 5 ? 'green' : 'red' }}>
            {range20Day.averageDailyRange}%
          </span> <br />
          20 Day ATR: ${safeFormat(range20Day.averageTrueRange)}
        </div>

        <div className="py-2 border-b border-dotted border-gray-300">
          52 week high: ${safeFormat(ticker["52WeekHigh"])} <br />
          52 week low: ${safeFormat(ticker["52WeekLow"])}
        </div>

        <div className="py-2">
          10 day average volume: {safeFormatVol(ticker['10DayAverageVolume'])} <br />      
          1 year average volume: {safeFormatVol(ticker['1YearAverageVolume'])}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500"> 
        ADR = Average Daily Range<br />
        ATR = Average True Range           
      </CardFooter>
    </Card>
  );
} 