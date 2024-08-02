class QuarterTime {
  constructor(id) {
    this.id = id;
    this.time = this.getTime();
  }

  getTime() {
    const timeNumber = minTime + (this.id - 1) / 4;
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
    return getTimeText(this.time.from.hour, this.time.from.minute);
  }

  getTimeTextTo() {
    return getTimeText(this.time.to.hour, this.time.to.minute);
  }

}
