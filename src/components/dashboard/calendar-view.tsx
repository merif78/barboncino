"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, getCategoryIcon } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: string | Date;
  category: string;
  color: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onDayClick?: (date: Date) => void;
}

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const MONTHS = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

export function CalendarView({ events, onDayClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDay = React.useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    events.forEach((event) => {
      const d = new Date(event.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(event);
      }
    });
    return map;
  }, [events, year, month]);

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-brown-600">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            aria-label="Mese precedente"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            aria-label="Mese successivo"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-brown-400">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => (
          <div
            key={idx}
            onClick={() => day && onDayClick?.(new Date(year, month, day))}
            className={cn(
              "min-h-[80px] rounded-md border border-transparent p-1 text-xs",
              day && "cursor-pointer border-beige-100 hover:border-pink-200",
              day && isToday(day) && "bg-pink-50 border-pink-300"
            )}
          >
            {day && (
              <>
                <div className="mb-1 text-right font-medium text-brown-500">{day}</div>
                <div className="flex flex-col gap-0.5">
                  {(eventsByDay[day] ?? []).slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      title={event.title}
                      className="truncate rounded px-1 py-0.5 text-[10px] text-white"
                      style={{ backgroundColor: event.color }}
                    >
                      {getCategoryIcon(event.category)} {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
