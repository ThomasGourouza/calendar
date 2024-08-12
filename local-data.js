const levels = [
  new Level("A0", 10),
  new Level("A1.2", 10),
  new Level("A2.2", 10),
  new Level("A2.3", 10),
  new Level("B1.1", 10),
  new Level("B1.2", 10),
  new Level("B1.3", 10),
  // new Level("B2.1", 10),
  // new Level("B2.2", 10),
  // new Level("B2.3", 10),
  // new Level("B2.4", 10),
  // new Level("B2/C1", 10),
  // new Level("C1.1", 10),
  // new Level("C1.2", 10),
  // new Level("C1.3", 10),
  // new Level("C1.4", 10),
  // new Level("C1.5", 10),
  // new Level("C1.6", 10),
  // new Level("C1.7", 10),
  // new Level("C1.8", 10),
];

let lessons = [
  new Lesson("08/08/2024", "Pauline", "A2.3"),
  new Lesson("09/08/2024", "Pauline", "A2.3"),
  new Lesson("09/08/2024", "Hervé", "A2.2"),
  new Lesson("12/08/2024", "Magda", "A0"),
  new Lesson("13/08/2024", "Delphine", "A1.2"),
];

const teachers = [
  new Teacher(
    "Pauline",
    "blue",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher("Hervé", "green", [], [], { min: 12, max: 12 }, []),
  new Teacher("Delphine", "yellow", [], [], { min: 4, max: undefined }, []),
  new Teacher("Magda", "red", [], [], { min: undefined, max: 8 }, []),
  new Teacher("Soufia", "aqua", [], [], { min: 4, max: 8 }, []),
  new Teacher(
    "Valérie",
    "orange",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "Julien",
    "beige",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher("Maeva", "blue", [], [], { min: undefined, max: undefined }, []),
  new Teacher(
    "Olivia",
    "green",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher(
    "François",
    "yellow",
    [],
    [],
    { min: undefined, max: undefined },
    []
  ),
  new Teacher("Aline", "red", [], [], { min: undefined, max: undefined }, []),
];

const translation = {};

const parameter = {
  startDate: "2024-08-08",
  numberDays: 20,
  bankHolidays: [],
  lessonDuration: 4,
};
