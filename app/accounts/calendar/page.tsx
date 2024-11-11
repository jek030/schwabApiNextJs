"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSchwabAccounts } from '../../lib/getSchwabAccounts';
import {Account} from '../../lib/utils';

interface EventCategory {
  name: string;
  color: string;
}

interface CalendarEvent {
  title: string;
  category: keyof typeof EVENT_CATEGORIES;
}

interface EventsState {
  [key: string]: CalendarEvent[];
}

const EVENT_CATEGORIES: Record<string, EventCategory> = {
  default: { name: 'Default', color: 'bg-blue-100 text-blue-800' },
  pnl: { name: 'P/L', color: 'bg-green-100 text-green-800' },
};

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventsState>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EVENT_CATEGORIES>('default');
  
  const daysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const startOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const monthNames: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const previousMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const nextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDateKey = (year: number, month: number, day: number): string => {
    return `${year}-${month}-${day}`;
  };

  const handleAddEvent = (): void => {
    if (newEvent.trim() && selectedDate) {
      const dateKey = selectedDate;
      const newEventObj: CalendarEvent = {
        title: newEvent.trim(),
        category: selectedCategory
      };
      
      setEvents(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newEventObj]
      }));
      setNewEvent('');
      setSelectedCategory('default');
    }
  };

  const renderEventBadge = (event: CalendarEvent): JSX.Element => {
    const categoryStyle = EVENT_CATEGORIES[event.category]?.color || EVENT_CATEGORIES.default.color;
    return (
      <div className={`text-xs truncate p-1 mb-1 rounded ${categoryStyle}`}>
        {event.title}
      </div>
    );
  };

  const CategoryLegend: React.FC = () => (
    <div className="flex flex-wrap gap-2 mt-4">
      {Object.entries(EVENT_CATEGORIES).map(([key, category]) => (
        <div key={key} className="flex items-center space-x-1">
          <div className={`w-3 h-3 rounded ${category.color.split(' ')[0]}`} />
          <span className="text-xs">{category.name}</span>
        </div>
      ))}
    </div>
  );

  const renderCalendar = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const totalDays = daysInMonth(currentDate);
    const startDay = startOfMonth(currentDate);
    
    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 p-2" />);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const dateKey = getDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = events[dateKey] || [];
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      
      days.push(
        <Dialog key={day}>
          <DialogTrigger asChild>
            <div
              className={`h-24 p-2 border border-gray-200 ${
                isToday ? 'bg-blue-50 font-bold' : ''
              } hover:bg-gray-50 cursor-pointer transition-colors relative`}
              onClick={() => setSelectedDate(dateKey)}
            >
              <div className="flex justify-between items-start">
                <span>{day}</span>
                {dayEvents.length > 0 && (
                  <span className="bg-gray-600 text-white text-xs px-1 rounded-full">
                    {dayEvents.length}
                  </span>
                )}
              </div>
              <div className="mt-1">
                {dayEvents.slice(0, 2).map((event, idx) => (
                  <div key={idx}>
                    {renderEventBadge(event)}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Events for {monthNames[currentDate.getMonth()]} {day}, {currentDate.getFullYear()}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Add new event"
                  value={newEvent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEvent(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleAddEvent()}
                />
                <Select value={selectedCategory} onValueChange={(value: keyof typeof EVENT_CATEGORIES) => setSelectedCategory(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EVENT_CATEGORIES).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded ${category.color.split(' ')[0]}`} />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddEvent} className="w-full">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Event
                </Button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {dayEvents.map((event, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-2 rounded ${EVENT_CATEGORIES[event.category]?.color || EVENT_CATEGORIES.default.color}`}>
                    <span>{event.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEvents(prev => ({
                          ...prev,
                          [dateKey]: prev[dateKey].filter((_, i) => i !== idx)
                        }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {dayEvents.length === 0 && (
                  <div className="text-gray-500 text-center py-4">
                    No events scheduled for this day
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
    
    return days;
  };

  // Function to get previous business day
  const getPreviousBusinessDay = (date: Date): Date => {
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() - 1);

    // Keep going back until we find a weekday (0 = Sunday, 6 = Saturday)
    while (previousDay.getDay() === 0 || previousDay.getDay() === 6) {
      previousDay.setDate(previousDay.getDate() - 1);
    }

    return previousDay;
  };

  // Add initial events on component mount

  useEffect(() => {
    const loadAccountEvents = async () => {
      try {
        const accounts = await getSchwabAccounts();
        console.log("Fetched accounts:", accounts);
        
        const prevBusinessDay = getPreviousBusinessDay(new Date());
        const dateKey = getDateKey(
          prevBusinessDay.getFullYear(),
          prevBusinessDay.getMonth(),
          prevBusinessDay.getDate()
        );
        console.log("Date key for events:", dateKey);


        let formattedAccounts: Account[] = Object.entries(accounts).map(([key,value]:[string,any]) => 
            ({
              key: key,
              accountNumber: value?.securitiesAccount?.accountNumber,
              roundTrips: value?.securitiesAccount?.roundTrips,
              accountValue: value?.securitiesAccount?.initialBalances?.accountValue,
              accountEquity: value?.securitiesAccount?.currentBalances?.equity,
              cashBalance: value?.securitiesAccount?.initialBalances?.cashBalance
            }));


        const accountEvents = formattedAccounts.map(account => ({
          title: account.accountNumber,
          category: 'pnl' as keyof typeof EVENT_CATEGORIES
        }));
        console.log("Created events:", accountEvents);

        setEvents(prev => {
          const newEvents = {
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), ...accountEvents]
          };
          console.log("New events state:", newEvents);
          return newEvents;
        });

      } catch (error) {
        console.error('Error loading accounts:', error);
      }
    };

    loadAccountEvents();
  }, []);
  return (
    <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full">
        <header className="flex flex-col sm:items-start"> 
          <p className="text-gray-800 md:text-2xl md:leading-normal">
            <strong>Welcome to FinanceGuy.</strong> This is the calendar page.
          </p>
        </header>

        <div className="min-h-screen p-2">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <CardTitle className="mb-2">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <CategoryLegend />
                </div>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="px-2">
              <div className="grid grid-cols-7 gap-px">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="h-12 p-2 font-semibold text-center">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;