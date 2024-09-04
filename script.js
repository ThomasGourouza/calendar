const colName1 = "prof";
const colName2 = "niv";
const dateFormat = "Y-m-d";
const dataLoaded = document.getElementById("data-loaded");
const constraintsLoaded = document.getElementById("constraints-loaded");
const eraseDataButton = document.getElementById("erase-data");
const notEraseDataButton = document.getElementById("not-erase-data");
const eraseConstraintsButton = document.getElementById("erase-constraints");
const notEraseConstraintsButton = document.getElementById(
  "not-erase-constraints"
);

const parameter = {
  startDate: localStorage.getItem("startDate") || getNextMonday(),
  numberDays: +localStorage.getItem("numberDays") || 20,
  bankHolidays: JSON.parse(localStorage.getItem("bankHolidays")) || [],
  lessonDuration: +localStorage.getItem("lessonDuration") || 4,
};

const openDays = [
  { day: 1, active: true },
  { day: 2, active: true },
  { day: 3, active: true },
  { day: 4, active: true },
  { day: 5, active: true },
  { day: 6, active: false },
  { day: 0, active: false },
];
buildHtmlOpenDays(openDays);

// récupère du localStorage
let teacherNames = localStorage.getItem("teacherNames")?.split(",") || [];
let levelNames = localStorage.getItem("levelNames")?.split(",") || [];
let constraints = JSON.parse(localStorage.getItem("constraints")) || [];

let levels = [];
let teachers = [];

let selectedDates = [];
let lessons = [];

const constraintsHeaders = [
  "Nom",
  "Indispos récurrentes",
  "Congés",
  "Volume horaire minimum",
  "Volume horaire maximum",
  "Niveaux préférés",
];
const noDataMessage = "Pas de données.";

// build HTML

if (levelNames.length > 0 && teacherNames.length > 0) {
  fillSelectOptions("levels", levelNames);
  fillSelectOptions("teachers", teacherNames);
  dataLoaded.innerHTML = localStorage.getItem("importMessage");
  eraseDataButton.style.display = "block";
  notEraseDataButton.style.display = "none";
} else {
  dataLoaded.innerHTML = noDataMessage;
  eraseDataButton.style.display = "none";
  notEraseDataButton.style.display = "block";
}
if (constraints.length > 0) {
  constraintsLoaded.innerHTML = localStorage.getItem(
    "importConstraintsMessage"
  );
  eraseConstraintsButton.style.display = "block";
  notEraseConstraintsButton.style.display = "none";
} else {
  constraintsLoaded.innerHTML = noDataMessage;
  eraseConstraintsButton.style.display = "none";
  notEraseConstraintsButton.style.display = "block";
}

const startDateInput = flatpickr("#startDate", {
  dateFormat,
});
const bankHolidaysInput = flatpickr("#bankHolidays", {
  mode: "multiple",
  dateFormat,
});
const addRemoveLessonDateInput = flatpickr("#date", {
  dateFormat,
});

// le formulaire des paramètres
const parameterForm = document.forms["parameter-form"];
parameterForm.onsubmit = parameterFormOnsubmit;
setForm(parameterForm, parameter, startDateInput, bankHolidaysInput);

// input de chargement des données
const fileInput = document.getElementById("file-input");
fileInput.addEventListener("change", loadTeachersAndLevels);

// input de chargement des données de contraintes
const fileInputConstraint = document.getElementById("file-input-constraints");
fileInputConstraint.addEventListener("change", loadConstraints);

// le formulaire des leçons (dernière page)
const addLessonForm = document.forms["addLesson-form"];
addLessonForm.onsubmit = addLessonFormOnsubmit;

// créer la liste des parametres pour les professeurs et les niveaux
function parameterFormOnsubmit(event) {
  event.preventDefault();
  if (!parameterForm.startDate.value) {
    alert("Date de début!");
    return;
  }
  if (levelNames.length === 0 || teacherNames.length === 0) {
    alert("Veuillez importer un fichier csv de professeurs et de niveaux.");
    return;
  }
  setParameters(this, parameter);
  localStorage.setItem("startDate", parameter.startDate);
  localStorage.setItem("numberDays", parameter.numberDays);
  localStorage.setItem("lessonDuration", parameter.lessonDuration);
  localStorage.setItem("bankHolidays", JSON.stringify(parameter.bankHolidays));

  selectedDates = getSelectedDates(
    parameter.startDate,
    parameter.numberDays,
    parameter.bankHolidays,
    openDays
  );
  levels = levelNames.map((l) => new Level(l, parameter.numberDays * parameter.lessonDuration));
  teachers = getTeachers(teacherNames, constraints, levelNames, parameter);
  buildConstraintsTableForm(teachers, levelNames, selectedDates, parameter, openDays);
  buildHtmlLevelsConditions(levels);
  navigate("conditions-wrapper");
}

// ajouter une leçon
function addLessonFormOnsubmit(event) {
  event.preventDefault();
  const newLesson = new Lesson(
    getLessonDate(this.date.value),
    this.teacherName.value,
    this.levelName.value
  );
  if (existLesson(newLesson, lessons)) {
    alert(
      `Une leçon existe déjà le ${newLesson.date} pour le niveau ${newLesson.levelName}.`
    );
    return;
  }
  if (
    openDays
      .filter((d) => !d.active)
      .map((d) => d.day)
      .includes(new Date(this.date.value).getDay())
  ) {
    alert(
      `Impossible d'ajouter une leçon. ${printDateFull(
        new Date(this.date.value)
      )} n'est pas un jour ouvré.`
    );
    return;
  }
  if (
    selectedDates
      .filter((d) => !!d.date && d.type !== "regular")
      .map((d) => d.date.getTime())
      .includes(new Date(this.date.value).getTime())
  ) {
    alert(
      `Impossible d'ajouter une leçon. ${printDateFull(
        new Date(this.date.value)
      )} est un jour férié.`
    );
    return;
  }
  if (
    !selectedDates
      .filter((d) => !!d.date && d.type === "regular")
      .map((d) => d.date.getTime())
      .includes(new Date(this.date.value).getTime())
  ) {
    alert(
      `Impossible d'ajouter une leçon. ${printDateFull(
        new Date(this.date.value)
      )} est hors de la période.`
    );
    return;
  }
  if (
    lessons
      .filter((l) => l.teacherName === newLesson.teacherName)
      .map((l) => l.localDate.getTime())
      .includes(newLesson.localDate.getTime())
  ) {
    alert(`${newLesson.teacherName} a déjà une leçon le ${newLesson.date}.`);
    return;
  }
  // create lesson
  lessons.push(newLesson);
  this.reset();
  buildHtml();
}

// supprimer une leçon
function removeLesson(date, levelName) {
  lessons = lessons.filter((lesson) => !isLesson(lesson, date, levelName));
  buildHtml();
}

// selectionner une leçon
function highlightLesson(date, levelName) {
  const lesson = lessons.find((l) => isLesson(l, date, levelName));
  if (!!lesson) {
    const previousHighlight = lesson.highlight;
    // reset all
    lessons.forEach((lesson) => (lesson.highlight = false));
    // set new
    lesson.highlight = !previousHighlight;
    buildHtml();
  }
}

// confirme les conditions
function confirmGenerateCalendar() {
  const invalidTeachers = teachers.filter(
    (t) =>
      !isValideHour(
        t.workingHours,
        parameter.lessonDuration,
        parameter.numberDays
      )
  );
  if (invalidTeachers.length > 0) {
    const invalidTeacherNames = invalidTeachers
      .map((t) => t.name)
      .join(", ")
      .replace(/, ([^,]*)$/, " et $1");
    alert(
      `${invalidTeacherNames}: Le Volume horaire doit être compris entre ${
        parameter.lessonDuration
      } et ${
        parameter.lessonDuration * parameter.numberDays
      }, et les bornes doivent être des multiples de ${
        parameter.lessonDuration
      }.`
    );
    return;
  }
  if (!levels.some((l) => l.active)) {
    alert("Aucun niveau sélectionné.");
    return;
  }
  generateLessonListAndBuildHtml();
  navigate("lessons-calendar-wrapper");
}

// génère les données des leçons et du calendrier
function generateLessonListAndBuildHtml() {
  const dates = selectedDates
    .filter((d) => d.type === "regular")
    .map((d) => getDateTextFromLocalDate(d.date));
  lessons = getLessons(
    dates,
    teachers,
    levels,
    parameter.lessonDuration,
    selectedDates
  );
  buildHtml();
  navigate("lessons-calendar-wrapper");
}

// construit la liste des leçons et le calendrier
function buildHtml() {
  buildHtmlLessonListAndCalendar(
    lessons,
    selectedDates,
    teachers,
    highlightLesson,
    removeLesson
  );
  buildHtmlResultConfirmations(
    teachers,
    levels.filter((l) => l.active),
    selectedDates,
    parameter.numberDays,
    parameter.lessonDuration,
    lessons,
    openDays
  );
}

// selectionner les niveaux
function selectOrUnselectAll(value) {
  levels.forEach((l) => (l.active = value));
  buildHtmlLevelsConditions(levels);
}

// importer données CSV
function downloadConditions() {
  doDownloadConditions(openDays);
}

// importer données CSV
function loadTeachersAndLevels(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      onLoadTeachersLevels(e, file);
    };
    reader.onerror = (e) => {
      alert("Une erreur est survenue.", e);
    };
    reader.readAsText(file, "UTF-8");
  }
}

// créer les listes de profs et niveaux
function onLoadTeachersLevels(e, file) {
  const nameList = file.name.split(".");
  const data = csvToArray(e.target.result);
  const keys = Object.keys(data[0]);
  if (!checkData(file, nameList, data) || !checkDataTeachersLevels(keys)) {
    return;
  }
  teacherNames = [];
  levelNames = [];
  const entries = data.map((entry) => Object.entries(entry));
  entries.forEach((entry) => {
    const teacher = entry.find((e) =>
      e[0].toLocaleLowerCase().includes("prof")
    )?.[1];
    if (!!teacher) {
      teacherNames.push(capitalize(teacher));
    }
    const level = entry.find((e) =>
      e[0].toLocaleLowerCase().includes("niv")
    )?.[1];
    if (!!level) {
      levelNames.push(formatLevel(level));
    }
  });
  if (levelNames.length > 0 && teacherNames.length > 0) {
    fillSelectOptions("levels", levelNames);
    fillSelectOptions("teachers", teacherNames);
    localStorage.setItem("levelNames", levelNames.join(","));
    localStorage.setItem("teacherNames", teacherNames.join(","));
    localStorage.setItem("importMessage", `"${file.name}"`);
    dataLoaded.innerHTML = localStorage.getItem("importMessage");
    eraseDataButton.style.display = "block";
    notEraseDataButton.style.display = "none";
  } else {
    dataLoaded.innerHTML = noDataMessage;
    eraseDataButton.style.display = "none";
    notEraseDataButton.style.display = "block";
  }
}

// importer données CSV
function loadConstraints(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      onLoadConstraints(e, file);
    };
    reader.onerror = (e) => {
      alert("Une erreur est survenue.", e);
    };
    reader.readAsText(file, "UTF-8");
  }
}

// créer les listes des contraintes
function onLoadConstraints(e, file) {
  const nameList = file.name.split(".");
  const data = csvToArray(e.target.result);
  const keys = Object.keys(data[0]);
  if (!checkData(file, nameList, data) || !checkDataConstraints(keys)) {
    return;
  }
  const entries = data.map((entry) => Object.entries(entry));
  const results = [];
  entries.forEach((entry) => {
    const item = {};
    entry.forEach((e) => {
      switch (e[0]) {
        case "Nom":
          item.name = e[1];
          break;
        case "Indispos récurrentes":
          item.recurrentDaysOff = e[1];
          break;
        case "Congés":
          item.daysOff = e[1];
          break;
        case "Volume horaire minimum":
          item.workingHourMin = e[1];
          break;
        case "Volume horaire maximum":
          item.workingHourMax = e[1];
          break;
        case "Niveaux préférés":
          item.preferedLevelNames = e[1];
          break;
        default:
          break;
      }
    });
    if (!!item.name) {
      results.push(item);
    }
  });
  if (results.length > 0) {
    localStorage.setItem("constraints", JSON.stringify(results));
    localStorage.setItem("importConstraintsMessage", `"${file.name}"`);
    constraintsLoaded.innerHTML = localStorage.getItem(
      "importConstraintsMessage"
    );
    eraseConstraintsButton.style.display = "block";
    notEraseConstraintsButton.style.display = "none";
    constraints = JSON.parse(localStorage.getItem("constraints"));
    teachers = getTeachers(teacherNames, constraints, levelNames, parameter);
    buildConstraintsTableForm(teachers, levelNames, selectedDates, parameter, openDays);
  }
}

function erase() {
  localStorage.removeItem("levelNames");
  localStorage.removeItem("teacherNames");
  teacherNames = [];
  levelNames = [];
  teachers = [];
  levels = [];
  dataLoaded.innerHTML = noDataMessage;
  eraseDataButton.style.display = "none";
  notEraseDataButton.style.display = "block";
}

function eraseConstraints() {
  localStorage.removeItem("constraints");
  constraints = [];
  teachers = getTeachers(teacherNames, constraints, levelNames, parameter);
  constraintsLoaded.innerHTML = noDataMessage;
  eraseConstraintsButton.style.display = "none";
  notEraseConstraintsButton.style.display = "block";
  buildConstraintsTableForm(teachers, levelNames, selectedDates, parameter, openDays);
}

// changer de section
function navigate(page) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  document.getElementById(page).style.display = "block";
}

// selectionner les jours ouvrés
function selectOrUnselectAllOpenDays(value) {
  openDays.forEach((d) => (d.active = value));
  buildHtmlOpenDays(openDays);
}

function resetHours() {
  teachers.forEach((teacher) => {
    teacher.workingHours.min = parameter.lessonDuration;
    teacher.workingHours.max = parameter.lessonDuration * parameter.numberDays;
  });
  buildConstraintsTableForm(teachers, levelNames, selectedDates, parameter, openDays);
}

function resetRecDaysOff() {
  teachers.forEach((teacher) => {
    teacher.recurrentDaysOff = [];
  });
  buildConstraintsTableForm(teachers, levelNames, selectedDates, parameter, openDays);
}

function resetDaysOff() {
  teachers.forEach((teacher) => {
    teacher.daysOff = [];
  });
  buildConstraintsTableForm(teachers, levelNames, selectedDates, parameter, openDays);
}

function resetPreferredLevels() {
  teachers.forEach((teacher) => {
    teacher.preferedLevelNames = [];
  });
  buildConstraintsTableForm(teachers, levelNames, selectedDates, parameter, openDays);
}
