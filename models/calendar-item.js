class CalendarItem {
  constructor(calendarItemDate, calendarItemTimeRooms) {
    this.calendarItemDate = calendarItemDate;
    this.calendarItemTimeRooms = calendarItemTimeRooms;
  }

  isDate(date, month, year) {
    return (
      this.calendarItemDate.date === date &&
      this.calendarItemDate.month === month &&
      this.calendarItemDate.year === year
    );
  }
}
