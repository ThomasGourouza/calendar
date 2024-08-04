class CalendarDate {
  constructor(date, month, year) {
    this.date = date;
    this.month = month + 1;
    this.year = year;
    // this.isHoliday = isHoliday;
  }

  getDate() {
    const d = this.date < 10 ? `0${this.date}` : this.date;
    const m = this.month < 10 ? `0${this.month}` : this.month;
    return `${d}/${m}/${this.year}`;
  }

  get day() {
    const day = new Date(this.year, this.month - 1, this.date).getDay();
    return day === 0 ? 7 : day;
  }

  printDate(param) {
    return (
      this.getDayText(this.day, param) +
      " " +
      this.date +
      " " +
      this.toMonthText(this.month, param) +
      " " +
      this.year
    );
  }

  getDayText(param) {
    switch (this.day) {
      case 1:
        return param.lang === "en" ? "Monday" : "Lundi";
      case 2:
        return param.lang === "en" ? "Tuesday" : "Mardi";
      case 3:
        return param.lang === "en" ? "Wednesday" : "Mercredi";
      case 4:
        return param.lang === "en" ? "Thursday" : "Jeudi";
      case 5:
        return param.lang === "en" ? "Friday" : "Vendredi";
      case 6:
        return param.lang === "en" ? "Saturday" : "Samedi";
      case 7:
        return param.lang === "en" ? "Sunday" : "Dimanche";
      default:
        return "";
    }
  }

  toMonthText(param) {
    switch (this.month) {
      case 1:
        return param.lang === "en" ? "January" : "Janvier";
      case 2:
        return param.lang === "en" ? "February" : "Février";
      case 3:
        return param.lang === "en" ? "March" : "Mars";
      case 4:
        return param.lang === "en" ? "April" : "Avril";
      case 5:
        return param.lang === "en" ? "May" : "Mai";
      case 6:
        return param.lang === "en" ? "June" : "Juin";
      case 7:
        return param.lang === "en" ? "July" : "Juillet";
      case 8:
        return param.lang === "en" ? "August" : "Août";
      case 9:
        return param.lang === "en" ? "September" : "Septembre";
      case 10:
        return param.lang === "en" ? "October" : "Octobre";
      case 11:
        return param.lang === "en" ? "November" : "Novembre";
      case 12:
        return param.lang === "en" ? "December" : "Décembre";
      default:
        return "";
    }
  }
}
