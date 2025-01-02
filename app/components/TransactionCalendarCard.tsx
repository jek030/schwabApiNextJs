import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/ui/card';
import { Suspense } from 'react';
import Calendar from './Calendar';
import { CalendarEvent } from '@/app/lib/utils';

export default function TransactionCalendarCard({ calendarEvents }: { calendarEvents: CalendarEvent[] }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction Calendar</CardTitle>
        <CardDescription>
          View your transactions in a calendar format.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        }>
          <Calendar events={calendarEvents} />
        </Suspense>
      </CardContent>
    </Card>
  );
} 