class ItemDate {
  constructor(year, month, date) {
    this.year = year;
    this.month = month + 1;
    this.date = date;
    this.day = this.getDate();
  }
  getDate() {
    const day = new Date(this.year, this.month - 1, this.date).getDay();
    return day === 0 ? 7 : day;
  }
}

// switch (day) {
//   case 1:
//     return lang === "en" ? "Monday" : "Lundi";
//   case 2:
//     return lang === "en" ? "Tuesday" : "Mardi";
//   case 3:
//     return lang === "en" ? "Wednesday" : "Mercredi";
//   case 4:
//     return lang === "en" ? "Thursday" : "Jeudi";
//   case 5:
//     return lang === "en" ? "Friday" : "Vendredi";
//   case 6:
//     return lang === "en" ? "Saturday" : "Samedi";
//   case 0:
//     return lang === "en" ? "Sunday" : "Dimanche";
//   default:
//     return "";
// }
