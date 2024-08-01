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

  getTimeTextFrom() {
    return this.getTimeText(this.time.from.hour, this.time.from.minute);
  }

  getTimeTextTo() {
    return this.getTimeText(this.time.to.hour, this.time.to.minute);
  }

  getTimeText(hour, minute) {
    return hour + ":" + this.format(minute);
  }

  format(minute) {
    return minute === 0 ? "00" : minute;
  }
}
