export interface CalendarSearchOptions {
  id: string;
  months?: number;
  offset?: number;
  nights?: number;
  timeZone?: string;
}

export interface CalendarSearchResult {
  checkIn: string;
  checkOut: string;
  lastNight: string;
  availableForCheckIn: boolean;
}
