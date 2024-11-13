"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {Account} from '../../lib/utils';

interface EventCategory {
  name: string;
  color: string;
}

interface CalendarEvent {
  title: string;
  category: string;
}

interface EventsState {
  [key: string]: CalendarEvent[];
}

const TAILWIND_COLORS = [
  'bg-red-100 text-red-800',
  'bg-green-100 text-green-800',
  'bg-blue-100 text-blue-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-orange-100 text-orange-800',
  'bg-teal-100 text-teal-800',
  'bg-cyan-100 text-cyan-800',
];

const CalendarPage: React.FC = () => {
    const initialized = useRef(false);
    const [formattedAccounts, setFormattedAccounts] = useState<Account[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventsState>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('default');
  const [eventCategories, setEventCategories] = useState<Record<string, EventCategory>>({
    default: { name: 'Default', color: 'bg-blue-100 text-blue-800' },
  });
  const [editingEvent, setEditingEvent] = useState<{ index: number; text: string } | null>(null);
  
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
    const categoryStyle = eventCategories[event.category]?.color || eventCategories.default.color;
    return (
      <div className={`text-xs truncate p-1 mb-1 rounded ${categoryStyle}`}>
        {event.title}
      </div>
    );
  };

  const CategoryLegend: React.FC = () => (
    <div className="flex flex-wrap gap-2 mt-4">
      {Object.entries(eventCategories).map(([key, category]) => (
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
                <Select value={selectedCategory} onValueChange={(value: string) => setSelectedCategory(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eventCategories).map(([key, category]) => (
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
                  <div key={idx} className={`flex justify-between items-center p-2 rounded ${eventCategories[event.category]?.color || eventCategories.default.color}`}>
                    {editingEvent?.index === idx ? (
                      <Input
                        value={editingEvent.text}
                        onChange={(e) => setEditingEvent({ ...editingEvent, text: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            setEvents(prev => ({
                              ...prev,
                              [selectedDate!]: prev[selectedDate!].map((ev, i) => 
                                i === idx ? { ...ev, title: editingEvent.text } : ev
                              )
                            }));
                            setEditingEvent(null);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <span>{event.title}</span>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEvent({ index: idx, text: event.title })}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEvents(prev => ({
                            ...prev,
                            [selectedDate!]: prev[selectedDate!].filter((_, i) => i !== idx)
                          }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
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
    if (initialized.current) return;

    async function loadAccountEvents() {
      try {
        const response = await fetch('/api/accounts');
                if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const formattedAccounts = await response.json();
                    setFormattedAccounts(formattedAccounts);
        
        const prevBusinessDay = getPreviousBusinessDay(new Date());
        const dateKey = getDateKey(
          prevBusinessDay.getFullYear(),
          prevBusinessDay.getMonth(),
          prevBusinessDay.getDate()
        );


        const accountEvents = formattedAccounts.map((account: Account) => ({
          title: account.accountNumber + " Account Value: $" + account.accountValue.toLocaleString(),
          category: account.accountNumber as keyof typeof eventCategories
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
    initialized.current = true;
    loadAccountEvents();

   
  }, []);

  useEffect(() => {
    if (formattedAccounts.length > 0) {
      const newCategories = formattedAccounts.reduce((acc, account, index) => ({
        ...acc,
        [account.accountNumber]: { 
          name: `Account ${account.accountNumber}`, 
          color: TAILWIND_COLORS[index % TAILWIND_COLORS.length] 
        }
      }), {});

      setEventCategories({
        default: { name: 'Default', color: 'bg-gray-100 text-gray-800' },
        ...newCategories
      });
    }
  }, [formattedAccounts]);

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
  ) ;
};

export default CalendarPage;