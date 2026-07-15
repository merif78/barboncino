"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { EventForm } from "@/components/dashboard/event-form";
import { useEvents } from "@/hooks/use-events";
import { useDogs } from "@/hooks/use-dogs";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function CalendarioPage() {
  const { events, isLoading, refresh } = useEvents();
  const { dogs } = useDogs();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brown-600">Calendario</h1>
          <p className="mt-1 text-brown-400">Vaccini, toelettatura, visite e promemoria</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuovo evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuovo evento</DialogTitle>
            </DialogHeader>
            <EventForm
              dogs={dogs}
              onSuccess={() => {
                setOpen(false);
                refresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <LoadingSkeleton count={1} /> : <CalendarView events={events} />}
    </div>
  );
}
