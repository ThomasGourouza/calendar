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

  getTimeText() {
    return (
      this.time.from.hour +
      ":" +
      this.format(this.time.from.minute) +
      " - " +
      this.time.to.hour +
      ":" +
      this.format(this.time.to.minute)
    );
  }

  format(minute) {
    return minute === 0 ? "00" : minute;
  }
}
