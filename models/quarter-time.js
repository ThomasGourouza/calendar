class QuarterTime {
  constructor(number) {
    this.number = number;
    this.time = this.getTime();
  }

  getTime() {
    const timeNumber = 8 + (this.number - 1) / 4;
    const hourFrom = Math.floor(timeNumber);
    const minuteFrom = (timeNumber - hourFrom) * 60;
    const timeNumberTo = timeNumber + 0.25;
    const hourTo = Math.floor(timeNumberTo);
    const minuteTo = (timeNumberTo - hourTo) * 60;
    return {
      from: {
        hour: hourFrom,
        minute: minuteFrom,
      },
      to: {
        hour: hourTo,
        minute: minuteTo,
      },
    };
  }

  getNumberFromStartTime(hourFrom, minuteFrom) {
    return (hourFrom + minuteFrom / 60 - 8) * 4 + 1;
  }
}
