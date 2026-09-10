export type HolidayType = {
  type: string;
  color: string;
};

export const HolidayTypes: HolidayType[] = [
  { type: 'Public Holiday', color: 'var(--app-vibrant-orange-1)' },
  { type: 'Earn Leave', color: 'var(--app-electric-blue-1)' },
];

export function CalendarIndicators() {
  return (
    <div className="flex items-center gap-6 ml-4 mt-4">
      {HolidayTypes.map((holiday) => (
        <div key={holiday.type} className="flex items-center flex-row gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: holiday.color }} />
          <span className="text-sm text-[var(--app-text)]">{holiday.type}</span>
        </div>
      ))}
    </div>
  );
}
