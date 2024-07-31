class ItemDate {
  constructor(year, month, date) {
    this.year = year;
    this.month = month + 1;
    this.date = date;
    this.day = this.getDay();
  }

  getDay() {
    const day = new Date(this.year, this.month - 1, this.date).getDay();
    return day === 0 ? 7 : day;
  }

  printDate() {
    return (
      this.toDayText(this.day) +
      " " +
      this.date +
      " " +
      this.toMonthText(this.month) +
      " " +
      this.year
    );
  }

  toDayText() {
    switch (this.day) {
      case 1:
        return lang === "en" ? "Monday" : "Lundi";
      case 2:
        return lang === "en" ? "Tuesday" : "Mardi";
      case 3:
        return lang === "en" ? "Wednesday" : "Mercredi";
      case 4:
        return lang === "en" ? "Thursday" : "Jeudi";
      case 5:
        return lang === "en" ? "Friday" : "Vendredi";
      case 6:
        return lang === "en" ? "Saturday" : "Samedi";
      case 7:
        return lang === "en" ? "Sunday" : "Dimanche";
      default:
        return "";
    }
  }

  toMonthText() {
    switch (this.month) {
      case 1:
        return lang === "en" ? "January" : "Janvier";
      case 2:
        return lang === "en" ? "February" : "Février";
      case 3:
        return lang === "en" ? "March" : "Mars";
      case 4:
        return lang === "en" ? "April" : "Avril";
      case 5:
        return lang === "en" ? "May" : "Mai";
      case 6:
        return lang === "en" ? "June" : "Juin";
      case 7:
        return lang === "en" ? "July" : "Juillet";
      case 8:
        return lang === "en" ? "August" : "Août";
      case 9:
        return lang === "en" ? "September" : "Septembre";
      case 10:
        return lang === "en" ? "October" : "Octobre";
      case 11:
        return lang === "en" ? "November" : "Novembre";
      case 12:
        return lang === "en" ? "December" : "Décembre";
      default:
        return "";
    }
  }
}
