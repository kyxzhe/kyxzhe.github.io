export const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export type Weekday = (typeof weekdays)[number];

const SLOT_BLUEPRINTS = [
  { key: "slot-10", label: "10:00 – 10:45 AEDT" },
  { key: "slot-11", label: "11:00 – 11:45 AEDT" },
  { key: "slot-14", label: "14:00 – 14:45 AEDT" },
  { key: "slot-15", label: "15:00 – 15:45 AEDT" },
  { key: "slot-16", label: "16:00 – 16:45 AEDT" },
] as const;

const BOOKED_SLOT_IDS = new Set<string>([
  "2025-01-21-slot-11",
  "2025-01-22-slot-14",
  "2025-01-24-slot-16",
]);

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  weekday: "short",
  day: "numeric",
  month: "short",
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

export function generateAvailability(startDate = new Date(), workdays = 30): DailyAvailability[] {
  const result: DailyAvailability[] = [];
  const cursor = new Date(startDate);
  cursor.setHours(0, 0, 0, 0);

  while (result.length < workdays) {
    const weekday = weekdays[cursor.getDay()];
    if (weekday !== "Saturday" && weekday !== "Sunday") {
      const iso = cursor.toISOString().split("T")[0];
      result.push({
        dateISO: iso,
        weekday,
        displayLabel: dateFormatter.format(cursor),
        slots: SLOT_BLUEPRINTS.map((slot) => {
          const slotId = `${iso}-${slot.key}`;
          return {
            id: slotId,
            label: slot.label,
            booked: BOOKED_SLOT_IDS.has(slotId),
          };
        }),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}
