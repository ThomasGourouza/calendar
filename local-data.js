const levels = [
  "A0",
  "A1.2",
  "A2.2",
  "A2.3",
  "B1.1",
  "B1.2",
  "B1.3",
  // "B2.1",
  // "B2.2",
  // "B2.3",
  // "B2.4",
  // "B2/C1",
  // "C1.1",
  // "C1.2",
  // "C1.3",
  // "C1.4",
  // "C1.5",
  // "C1.6",
  // "C1.7",
  // "C1.8",
];

let lessons = [
  new Lesson("08/08/2024", "Pauline", "A2.3"),
  new Lesson("09/08/2024", "Pauline", "A2.3"),
  new Lesson("09/08/2024", "Hervé", "A2.2"),
  new Lesson("12/08/2024", "Magda", "A0"),
  new Lesson("13/08/2024", "Delphine", "A1.2"),
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
  startDate: "2024-08-08",
  numberDays: 20,
  bankHolidays: [],
  lessonDuration: 4,
};
