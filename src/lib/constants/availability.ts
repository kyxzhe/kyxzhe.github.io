export type Weekday =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

const SLOT_BLUEPRINTS = [
  { key: "slot-10", label: "10:00 – 10:45 Sydney time", startMinutes: 10 * 60 },
  { key: "slot-11", label: "11:00 – 11:45 Sydney time", startMinutes: 11 * 60 },
  { key: "slot-14", label: "14:00 – 14:45 Sydney time", startMinutes: 14 * 60 },
  { key: "slot-15", label: "15:00 – 15:45 Sydney time", startMinutes: 15 * 60 },
  { key: "slot-16", label: "16:00 – 16:45 Sydney time", startMinutes: 16 * 60 },
] as const;

const SYDNEY_TIME_ZONE = "Australia/Sydney";

const dateKeyFormatter = new Intl.DateTimeFormat("en-AU", {
  timeZone: SYDNEY_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-AU", {
  timeZone: SYDNEY_TIME_ZONE,
  weekday: "long",
});

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  timeZone: SYDNEY_TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("en-AU", {
  timeZone: SYDNEY_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export type SlotInstance = {
  id: string;
  label: string;
  booked: boolean;
};

export type DailyAvailability = {
  dateISO: string;
  weekday: Weekday;
  displayLabel: string;
  slots: SlotInstance[];
};

function getSydneyDateKey(date: Date) {
  const parts = Object.fromEntries(
    dateKeyFormatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
}

function getSydneyWeekday(date: Date): Weekday {
  return weekdayFormatter.format(date) as Weekday;
}

function createSydneyDateCursor(date: Date) {
  return new Date(`${getSydneyDateKey(date)}T12:00:00.000Z`);
}

function getSydneyMinutes(date: Date) {
  const parts = Object.fromEntries(
    timeFormatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return Number(parts.hour) * 60 + Number(parts.minute);
}

export function generateAvailability(startDate = new Date(), workdays = 30): DailyAvailability[] {
  const result: DailyAvailability[] = [];
  const cursor = createSydneyDateCursor(startDate);
  const today = getSydneyDateKey(startDate);
  const currentMinutes = getSydneyMinutes(startDate);

  while (result.length < workdays) {
    const weekday = getSydneyWeekday(cursor);
    if (weekday !== "Saturday" && weekday !== "Sunday") {
      const iso = getSydneyDateKey(cursor);
      const slots = SLOT_BLUEPRINTS.map((slot) => ({
        id: `${iso}-${slot.key}`,
        label: slot.label,
        booked:
          iso < today ||
          (iso === today && slot.startMinutes <= currentMinutes),
      }));

      if (slots.every((slot) => slot.booked)) {
        cursor.setUTCDate(cursor.getUTCDate() + 1);
        continue;
      }

      result.push({
        dateISO: iso,
        weekday,
        displayLabel: dateFormatter.format(cursor),
        slots,
      });
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}
