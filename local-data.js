const levels = [
  { name: "A0", color: "lightBlue" },
  { name: "A1.2", color: "green" },
  { name: "A2.2", color: "yellow" },
  { name: "A2.3", color: "green" },
  { name: "B1.1", color: "aqua" },
  { name: "B1.2", color: "orange" },
  { name: "B1.3", color: "beige" },
  { name: "B2.1", color: "lightBlue" },
  { name: "B2.2", color: "green" },
  { name: "B2.3", color: "yellow" },
  { name: "B2.4", color: "red" },
  { name: "B2/C1", color: "aqua" },
  { name: "C1.1", color: "orange" },
  { name: "C1.2", color: "lightBlue" },
  { name: "C1.3", color: "green" },
  { name: "C1.4", color: "yellow" },
  { name: "C1.5", color: "red" },
  { name: "C1.6", color: "aqua" },
  { name: "C1.7", color: "orange" },
  { name: "C1.8", color: "beige" },
];

let lessons = [
  new Lesson("09/08/2024", "09:00-10:00", "Pauline", "A2.3"),
  new Lesson("10/08/2024", "08:00-09:00", "Magda", "B2.4"),
  new Lesson("11/08/2024", "09:30-11:00", "Pauline", "B2.4"),
  new Lesson("09/08/2024", "09:15-10:30", "Hervé", "C1.2"),
  new Lesson("08/08/2024", "09:00-10:00", "Pauline", "A2.3"),
];

const teachers = [
  { name: "Pauline", color: "blue" },
  { name: "Hervé", color: "green" },
  { name: "Delphine", color: "yellow" },
  { name: "Magda", color: "red" },
  { name: "Soufia", color: "aqua" },
  { name: "Valérie", color: "orange" },
  { name: "Julien", color: "beige" },
  { name: "Maeva", color: "blue" },
  { name: "Olivia", color: "green" },
  { name: "François", color: "yellow" },
  { name: "Aline", color: "red" },
];

const translation = {};

const parameter = {
  lang: "fr",
  minTime: 8,
  maxTime: 20,
  minLunchTime: 12,
  maxLunchTime: 14,
  minLessonTime: 30,
  maxLessonTime: 120,
  maxDays: 20,
  colorLessonBy: "teacherName",
  visibility: "all",
  startDate: "2024-08-08",
  endDate: "2024-08-11",
};
