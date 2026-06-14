import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/components/ui/widget";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const EVENT_DAYS = [
  {
    date: new Date(2026, 6, 11),
    events: [
      { title: "Arrival", location: "Whitefield", start: "14:00", end: "15:00" },
      { title: "Kickoff", location: "Whitefield", start: "16:00", end: "18:00" },
      { title: "Evening", location: "Whitefield", start: "18:30", end: "21:00" },
      { title: "Night build", location: "Whitefield", start: "22:00", end: "02:00" },
    ],
  },
  {
    date: new Date(2026, 6, 12),
    events: [
      { title: "Standup", location: "Whitefield", start: "09:00", end: "09:30" },
      { title: "Lunch", location: "Whitefield", start: "12:00", end: "13:00" },
      { title: "Demo prep", location: "Whitefield", start: "15:00", end: "17:00" },
      { title: "Showcase", location: "Whitefield", start: "18:00", end: "20:00" },
    ],
  },
] as const;

type VenueDatesWidgetProps = {
  className?: string;
};

function EventCard({
  title,
  location,
  start,
  end,
}: {
  title: string;
  location: string;
  start: string;
  end: string;
}) {
  return (
    <div className="flex min-h-14 w-full items-center justify-between gap-3 rounded-lg bg-secondary/80 px-3 py-2.5">
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{location}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5 tabular-nums">
        <p className="text-sm font-medium text-foreground">{start}</p>
        <p className="text-xs text-muted-foreground">{end}</p>
      </div>
    </div>
  );
}

function DayRow({
  date,
  weekday,
  events,
}: {
  date: number;
  weekday: string;
  events: (typeof EVENT_DAYS)[number]["events"];
}) {
  return (
    <div className="grid w-full grid-cols-[3.25rem_minmax(0,1fr)] items-start gap-4">
      <div className="flex flex-col items-center pt-1">
        <span className="text-3xl leading-none font-medium tabular-nums text-foreground">
          {date}
        </span>
        <span className="mt-1 text-center text-xs font-light tracking-wide text-muted-foreground uppercase">
          {weekday}
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        {events.map((event) => (
          <EventCard key={event.title} {...event} />
        ))}
      </div>
    </div>
  );
}

export default function VenueDatesWidget({ className }: VenueDatesWidgetProps) {
  return (
    <Widget size="lg" className={cn("venue-widget h-full p-0", className)}>
      <WidgetHeader className="bg-destructive px-4 py-3.5">
        <WidgetTitle className="text-2xl text-white">July</WidgetTitle>
      </WidgetHeader>

      <WidgetContent className="flex-1 gap-0 p-4">
        {EVENT_DAYS.map((day, index) => {
          const date = day.date.getDate();
          const weekday = day.date.toLocaleDateString("en-US", {
            weekday: "short",
          });

          return (
            <div key={day.date.toISOString()} className="w-full">
              {index > 0 ? <Separator className="my-4 bg-white/10" /> : null}
              <DayRow date={date} weekday={weekday} events={day.events} />
            </div>
          );
        })}
      </WidgetContent>
    </Widget>
  );
}
