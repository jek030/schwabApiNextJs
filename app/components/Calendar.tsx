"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CalendarProps {
  events?: {
    date: string;
    title: string;
    category?: string;
  }[];
}

const Calendar: React.FC<CalendarProps> = ({ events: initialEvents = [] }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('default');

  const handleAddEvent = () => {
    if (newEvent.trim() && selectedDate) {
      const newEventObj = {
        date: selectedDate,
        title: newEvent.trim(),
        category: selectedCategory
      };
      setEvents([...events, newEventObj]);
      setNewEvent('');
    }
  };

  const monthNames: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderEventBadge = (event: { title: string; category?: string }) => (
    <div className={`text-xs truncate p-1 mb-1 rounded ${
      event.category === 'profit' ? 'bg-green-100 text-green-800' : 
      event.category === 'loss' ? 'bg-red-100 text-red-800' : 
      'bg-blue-100 text-blue-800'
    }`}>
      {event.title}
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
      const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
      const dayEvents = events.filter(event => event.date === dateString);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <Dialog key={day}>
          <DialogTrigger asChild>
            <div
              className={`h-24 p-2 border border-gray-200 ${
                isToday ? 'bg-blue-50 font-bold' : ''
              } hover:bg-gray-50 cursor-pointer transition-colors`}
              onClick={() => setSelectedDate(dateString)}
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
                {dayEvents.map((event, idx) => (
                  <div key={idx}>{renderEventBadge(event)}</div>
                ))}
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add Event for {monthNames[currentDate.getMonth()]} {day}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter event title"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddEvent()}
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="profit">PNL</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddEvent} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
              <div className="space-y-2">
                {dayEvents.map((event, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    {renderEventBadge(event)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEvents(events.filter((_, i) => i !== idx));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    return days;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <CardTitle>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
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
  );
};

export default Calendar; 