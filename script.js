const colName1 = "prof";
const colName2 = "niv";
const dateFormat = "Y-m-d";
const dataLoaded = document.getElementById("data-loaded");
const constraintsLoaded = document.getElementById("constraints-loaded");
const eraseDataButton = document.getElementById("erase-data");
const eraseConstraintsButton = document.getElementById("erase-constraints");

const parameter = {
  startDate: getNextMonday(),
  numberDays: 20,
  bankHolidays: [],
  lessonDuration: 4,
};

// récupère du localStorage
let teacherNames = localStorage.getItem("teacherNames")?.split(",") ?? [];
let levelNames = localStorage.getItem("levelNames")?.split(",") ?? [];
let askConfirmation = ["true", "false"].includes(
  localStorage.getItem("askConfirmation")
)
  ? localStorage.getItem("askConfirmation") === "true"
  : true;
let constraints = JSON.parse(localStorage.getItem("constraints")) ?? [];

let levels = levelNames.map((l) => new Level(l));
let teachers = getTeachers(teacherNames, constraints, levelNames);

let selectedDates = [];
let lessons = [];

const constraintsHeaders = [
  "Nom",
  "Indispos réc.",
  "Congés",
  "Volume horaire min",
  "Vol horaire max",
  "Niveaux préférés",
];

const teachersLevelsTitle = "Profs/niveaux";
const constraintsTitle = "Contraintes";
const noDataMessage = "Pas de données";
const successImportMessage = "importé avec succès";
const teachersLevelsDataMessage = `${teachersLevelsTitle}: ${noDataMessage}.`;
const contraintesDataMessage = `${constraintsTitle}: ${noDataMessage}.`;

// build HTML

if (levelNames.length > 0 && teacherNames.length > 0) {
  fillSelectOptions("levels", levelNames);
  fillSelectOptions("teachers", teacherNames);
  dataLoaded.innerHTML = localStorage.getItem("importMessage");
  eraseDataButton.style.display = "block";
} else {
  dataLoaded.innerHTML = teachersLevelsDataMessage;
  eraseDataButton.style.display = "none";
}
if (constraints.length > 0) {
  constraintsLoaded.innerHTML = localStorage.getItem(
    "importConstraintsMessage"
  );
  eraseConstraintsButton.style.display = "block";
} else {
  constraintsLoaded.innerHTML = contraintesDataMessage;
  eraseConstraintsButton.style.display = "none";
}

const askConfirmationCheckbox = document.getElementById("ask-confirmation");
askConfirmationCheckbox.checked = askConfirmation;
askConfirmationCheckbox.addEventListener("change", (event) => {
  askConfirmation = event.target.checked;
  localStorage.setItem("askConfirmation", askConfirmation);
});

flatpickr("#startDate", {
  dateFormat,
});
flatpickr("#bankHolidays", {
  mode: "multiple",
  dateFormat,
});

// le formulaire des paramètres
const parameterForm = document.forms["parameter-form"];
parameterForm.onsubmit = parameterFormOnsubmit;
setForm(parameterForm, parameter);

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
  selectedDates = getSelectedDates(
    parameter.startDate,
    parameter.numberDays,
    parameter.bankHolidays
  );
  const regularDates = selectedDates
    .filter((date) => date.type === "regular")
    .map((date) => date.date);
  const firstDate = selectedDates.map((date) => date.date)[0];
  const lastDate = regularDates[regularDates.length - 1];
  buildHtmlTeachersConditions(
    teachers,
    levelNames,
    printDateFull(firstDate),
    printDateFull(lastDate),
    parameter.lessonDuration,
    parameter.numberDays,
    selectedDates
      .filter((date) => date.type === "holiday")
      .map((date) => date.date)
  );
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
  if ([0, 6].includes(new Date(this.date.value).getDay())) {
    alert(
      `Impossible d'ajouter une leçon. ${printDateFull(
        new Date(this.date.value)
      )} est un weekend.`
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
  const teacherListCopy = teachers.map(
    (t) =>
      new Teacher(
        t.name,
        t.backgroundColor,
        t.textColor,
        t.workingHours.min,
        t.workingHours.max,
        t.recurrentDaysOff,
        t.daysOff,
        t.preferedLevelNames.filter((n) => levelNames.includes(n))
      )
  );
  lessons = getLessonList(
    dates,
    teacherListCopy,
    levels.filter((l) => l.active).map((l) => new Level(l.name, l.active)),
    parameter.lessonDuration,
    selectedDates
  );
  buildHtml();
  navigate("lessons-calendar-wrapper");
}

function reGenerateCalendar() {
  const message = "Le calendrier actuel sera perdu";
  if (
    !askConfirmation ||
    (askConfirmation && confirm(`${message}. Continuer?`))
  ) {
    generateLessonListAndBuildHtml();
  }
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
    lessons
  );
}

// selectionner les niveaux
function selectOrUnselectAll(value) {
  levels.forEach((l) => (l.active = value));
  buildHtmlLevelsConditions(levels);
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
  checkData(file, nameList, data);
  checkDataTeachersLevels(keys);
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
    localStorage.setItem(
      "importMessage",
      `${teachersLevelsTitle}: "${file.name}" ${successImportMessage}.`
    );
    dataLoaded.innerHTML = localStorage.getItem("importMessage");
    levels = levelNames.map((l) => new Level(l));
    teachers = getTeachers(teacherNames, constraints, levelNames);
    eraseDataButton.style.display = "block";
  } else {
    dataLoaded.innerHTML = teachersLevelsDataMessage;
    eraseDataButton.style.display = "none";
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
  checkData(file, nameList, data);
  checkDataConstraints(keys);
  const entries = data.map((entry) => Object.entries(entry));
  const results = [];
  entries.forEach((entry) => {
    const item = {};
    entry.forEach((e) => {
      switch (e[0]) {
        case "Nom":
          item.name = e[1];
          break;
        case "Indispos réc.":
          item.recurrentDaysOff = e[1];
          break;
        case "Congés":
          item.daysOff = e[1];
          break;
        case "Volume horaire min":
          item.workingHourMin = e[1];
          break;
        case "Vol horaire max":
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
    localStorage.setItem(
      "importConstraintsMessage",
      `${constraintsTitle}: "${file.name}" ${successImportMessage}.`
    );
    constraintsLoaded.innerHTML = localStorage.getItem(
      "importConstraintsMessage"
    );
    eraseConstraintsButton.style.display = "block";
    constraints = JSON.parse(localStorage.getItem("constraints"));
    teachers = getTeachers(teacherNames, constraints, levelNames);
  } else {
    constraintsLoaded.innerHTML = contraintesDataMessage;
    eraseConstraintsButton.style.display = "none";
  }
}

function erase() {
  localStorage.removeItem("levelNames");
  localStorage.removeItem("teacherNames");
  teacherNames = [];
  levelNames = [];
  teachers = [];
  levels = [];
  dataLoaded.innerHTML = teachersLevelsDataMessage;
  eraseDataButton.style.display = "none";
}

function eraseConstraints() {
  localStorage.removeItem("constraints");
  constraints = [];
  teachers = getTeachers(teacherNames, constraints, levelNames);
  constraintsLoaded.innerHTML = contraintesDataMessage;
  eraseConstraintsButton.style.display = "none";
}

// changer de section
function goBackTo(page) {
  const message = "Le calendrier actuel sera perdu";
  if (
    !askConfirmation ||
    (askConfirmation && confirm(`${message}. Continuer?`))
  ) {
    navigate(page);
  }
}
function navigate(page) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  document.getElementById(page).style.display = "block";
}
