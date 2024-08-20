const colName1 = "prof";
const colName2 = "niv";
const dateFormat = "Y-m-d";
const dataLoaded = document.getElementById("data-loaded");
const eraseData = document.getElementById("erase-data");

// récupère du localStorage
let teacherNames = localStorage.getItem("teacherNames")?.split(",") ?? [];
let levelNames = localStorage.getItem("levelNames")?.split(",") ?? [];
let askConfirmation = ["true", "false"].includes(
  localStorage.getItem("askConfirmation")
)
  ? localStorage.getItem("askConfirmation") === "true"
  : true;

let parameter = {
  startDate: getNextMonday(),
  numberDays: 20,
  bankHolidays: [],
  lessonDuration: 4,
};
let selectedDates = [];
let levels = [];
let teachers = [];
let lessons = [];

fillTeachersAndLevels();

function fillTeachersAndLevels() {
  teachers = teacherNames.map((t, index) => {
    const color = colors[index % colors.length];
    return new Teacher(
      t,
      color.backgroundColor,
      color.textColor
      // 40,
      // 60,
      // ["1", "3"],
      // ["2024-08-20", "2024-08-21", "2024-08-22", "2024-08-28", "2024-08-30"],
      // ["A0", "A1.2"]
    );
  });
  levels = levelNames.map((l) => new Level(l));
}


// build HTML

if (levelNames.length > 0 && teacherNames.length > 0) {
  fillSelectOptions("levels", levelNames);
  fillSelectOptions("teachers", teacherNames);
  dataLoaded.innerHTML = localStorage.getItem("importMessage");
  eraseData.style.display = "block";
} else {
  dataLoaded.innerHTML = "Pas de données.";
  eraseData.style.display = "none";
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
fileInput.addEventListener("change", readSingleFile);

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
        t.preferedLevelNames
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
function readSingleFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      onLoadData(e, file);
    };
    reader.onerror = (e) => {
      alert("Une erreur est survenue.", e);
    };
    reader.readAsText(file, "UTF-8");
  }
}

// créer les listes de profs et niveaux
function onLoadData(e, file) {
  const nameList = file.name.split(".");
  const data = csvToArray(e.target.result);
  const keys = Object.keys(data[0]);
  checkData(file, nameList, data, keys);
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
      `Fichier "${file.name}" importé avec succès.`
    );
    dataLoaded.innerHTML = localStorage.getItem("importMessage");
    fillTeachersAndLevels();
    eraseData.style.display = "block";
  } else {
    dataLoaded.innerHTML = "Pas de données.";
    eraseData.style.display = "none";
  }
}

function erase() {
  const message = "Effacer la liste des professeurs et des niveaux ?";
  if (!askConfirmation || (askConfirmation && confirm(message))) {
    localStorage.removeItem("levelNames");
    localStorage.removeItem("teacherNames");
    teacherNames = [];
    levelNames = [];
    dataLoaded.innerHTML = "Pas de données.";
    eraseData.style.display = "none";
  }
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
