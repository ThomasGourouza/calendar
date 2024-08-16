// const levels = [
//   new Level("A0", parameter),
//   new Level("A1.2", parameter),
//   new Level("A2.2", parameter),
//   new Level("A2.3", parameter),
//   new Level("B1.1", parameter),
//   new Level("B1.2", parameter),
//   new Level("B1.3", parameter),
//   new Level("B2.1", parameter),
//   new Level("B2.2", parameter),
//   new Level("B2.3", parameter),
//   new Level("B2.4", parameter),
//   new Level("B2/C1", parameter),
//   new Level("C1.1", parameter),
//   new Level("C1.2", parameter),
//   new Level("C1.3", parameter),
//   new Level("C1.4", parameter),
//   new Level("C1.5", parameter),
//   new Level("C1.6", parameter),
//   new Level("C1.7", parameter),
//   new Level("C1.8", parameter),
// ];
const levelNames = [
  "A0",
  "A1.2",
  "A2.2",
  "A2.3",
  "B1.1",
  "B1.2",
  "B1.3",
  "B2.1",
  "B2.2",
  "B2.3",
  "B2.4",
  "B2/C1",
  "C1.1",
  "C1.2",
  "C1.3",
  "C1.4",
  "C1.5",
  "C1.6",
  "C1.7",
  "C1.8",
];

const teachers = [
  new Teacher(
    "Pauline",
    "blue",
    "white",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "Hervé",
    "green",
    "white",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "Delphine",
    "yellow",
    "black",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "Magda",
    "red",
    "white",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "Soufia",
    "aqua",
    "black",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "Valérie",
    "orange",
    "black",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "Julien",
    "beige",
    "black",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "Maeva",
    "blue",
    "white",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "Olivia",
    "green",
    "white",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "François",
    "yellow",
    "black",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "Aline",
    "red",
    "white",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
];

const translation = {};

const parameter = {
  startDate: textDateToInput(new Date()),
  numberDays: 20,
  bankHolidays: [],
  lessonDuration: 4,
};
