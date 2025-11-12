export type AvailabilitySlot = {
  id: string;
  label: string;
  day: string;
  timeRange: string;
  iso: string;
  booked?: boolean;
};

export const availabilitySlots: AvailabilitySlot[] = [
  {
    id: "wed-mentor-1",
    label: "Mentoring / Guest talks",
    day: "Wednesday",
    timeRange: "16:00 – 16:45 AEDT",
    iso: "2025-01-22T16:00:00+11:00",
  },
  {
    id: "wed-mentor-2",
    label: "Mentoring / Guest talks",
    day: "Wednesday",
    timeRange: "17:00 – 17:45 AEDT",
    iso: "2025-01-22T17:00:00+11:00",
    booked: true,
  },
  {
    id: "thu-research-1",
    label: "Research syncs",
    day: "Thursday",
    timeRange: "10:00 – 10:45 AEDT",
    iso: "2025-01-23T10:00:00+11:00",
  },
  {
    id: "thu-research-2",
    label: "Research syncs",
    day: "Thursday",
    timeRange: "11:00 – 11:45 AEDT",
    iso: "2025-01-23T11:00:00+11:00",
  },
  {
    id: "fri-consult-1",
    label: "Consulting office hours",
    day: "Friday",
    timeRange: "14:00 – 14:45 AEDT",
    iso: "2025-01-24T14:00:00+11:00",
  },
  {
    id: "fri-consult-2",
    label: "Consulting office hours",
    day: "Friday",
    timeRange: "15:00 – 15:45 AEDT",
    iso: "2025-01-24T15:00:00+11:00",
  },
];
