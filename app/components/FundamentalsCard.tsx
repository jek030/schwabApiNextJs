import { Card, CardHeader, CardTitle, CardContent } from '@/app/ui/card';
import { Divider } from "@nextui-org/react";
import { Ticker } from '@/app/lib/utils';
import { safeFormat } from '@/app/lib/formatters';

interface FundamentalsCardProps {
  ticker: Ticker;
}

export function FundamentalsCard({ ticker }: FundamentalsCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fundamentals</CardTitle>       
        <Divider />       
      </CardHeader>
      <CardContent>
        <div className="pb-2 border-b border-dotted border-gray-300">
          P/E Ratio: <span style={{ color: ticker.peRatio < 0 ? 'red' : 'black' }}> 
            {safeFormat(ticker.peRatio)} 
          </span>
        </div>

        <div className="py-2 border-b border-dotted border-gray-300">
          EPS: <span style={{ color: ticker.eps < 0 ? 'red' : 'black' }}> 
            {safeFormat(ticker.eps)} 
          </span>
        </div>

        <div className="py-2 border-b border-dotted border-gray-300">
          Next ex-dividend date: {ticker?.nextDivExDate ? 
            new Date(ticker.nextDivExDate).toLocaleString('en-US', {
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            }) 
            : 'N/A'}
        </div>

        <div className="py-2">
          Dividend yield: {safeFormat(ticker.divYield)}%
        </div>
      </CardContent>
    </Card>
  );
} 