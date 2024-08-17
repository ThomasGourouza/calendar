const colName1 = "prof";
const colName2 = "niv";
const dateFormat = "Y-m-d";

// récupère du localStorage
let teacherNames = localStorage.getItem("teacherNames")?.split(",") ?? [];
let levelNames = localStorage.getItem("levelNames")?.split(",") ?? [];
let askConfirmation = ["true", "false"].includes(
  localStorage.getItem("askConfirmation")
)
  ? localStorage.getItem("askConfirmation") === "true"
  : true;

let parameter;
let selectedDates;
let levels;
let teachers;
let lessons;
init();

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
  const firstDate = regularDates[0];
  const lastDate = regularDates[regularDates.length - 1];
  teachers = teacherNames.map(
    (t, index) => new Teacher(t, parameter, colors[index % colors.length])
  );
  buildHtmlTeachersConditions(
    teachers,
    levelNames,
    printDateFull(firstDate),
    printDateFull(lastDate),
    parameter.lessonDuration,
    parameter.numberDays,
    parameter.bankHolidays
  );
  document.getElementById("levels-checkbox").checked = true;
  levels = levelNames.map((l) => new Level(l, parameter));
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

// génère le récapitulatif des conditions
function generateTeacherAndLevelConditions() {
  if (
    isValide(
      teachers.map((teacher) => teacher.workingHours),
      parameter.lessonDuration,
      parameter.numberDays
    )
  ) {
    if (levels.some((l) => l.active)) {
      buildHtmlConfirmations(
        teachers,
        levels.filter((l) => l.active),
        selectedDates
      );
      navigate("confirmation-wrapper");
    } else {
      alert("Aucun niveau sélectionné.");
      return;
    }
  } else {
    const invalidTeachers = teachers
      .filter(
        (t) =>
          !!t.workingHours.min &&
          !!t.workingHours.max &&
          (+t.workingHours.min > +t.workingHours.max ||
            +t.workingHours.min < parameter.lessonDuration ||
            +t.workingHours.max >
              parameter.lessonDuration * parameter.numberDays)
      )
      .map((t) => t.name)
      .join(", ")
      .replace(/, ([^,]*)$/, " et $1");
    alert(
      `Volume horaire incorrect pour ${invalidTeachers}. min ≥ ${
        parameter.lessonDuration
      }, max ≤ ${parameter.lessonDuration * parameter.numberDays} et min ≤ max.`
    );
    return;
  }
}

// génère les données des leçons et du calendrier
function generateLessonListAndBuildHtml() {
  const dates = selectedDates
    .filter((d) => d.type === "regular")
    .map((d) => getDateTextFromLocalDate(d.date));
  lessons = getLessonList(
    dates,
    teachers.map((t) => ({
      ...t,
      availabilities: t.getAvailabilities(selectedDates),
    })),
    levels.filter((l) => l.active).map((l) => ({ ...l })),
    parameter.lessonDuration
  );
  buildHtml();
  navigate("lessons-calendar-wrapper");
}

// construit la liste des leçons et le calendrier
function buildHtml() {
  return buildHtmlLessonListAndCalendar(
    lessons,
    selectedDates,
    teachers,
    highlightLesson,
    removeLesson
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
    document.getElementById(
      "data-loaded"
    ).innerHTML = `Fichier "${file.name}" importé avec succès.`;
  }
}

// changer de section
function goBackTo(page, from = undefined) {
  if (page === "settings-wrapper") {
    const message =
      from === "lessons-calendar-wrapper"
        ? "Le calendrier actuel sera perdu"
        : "Vous allez perdre vos modifications";
    if (
      !askConfirmation ||
      (askConfirmation && confirm(`${message}. Continuer?`))
    ) {
      init();
      navigate(page);
    }
  } else {
    navigate(page);
  }
}
function navigate(page) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  document.getElementById(page).style.display = "block";
}

function init() {
  parameter = {
    startDate: getNextMonday(),
    numberDays: 20,
    bankHolidays: [],
    lessonDuration: 4,
  };
  selectedDates = [];
  levels = [];
  teachers = [];
  lessons = [];
  if (levelNames.length > 0 && teacherNames.length > 0) {
    fillSelectOptions("levels", levelNames);
    fillSelectOptions("teachers", teacherNames);
    document.getElementById("data-loaded").innerHTML = "Données présentes.";
  }
}

function confirmGenerateCalendar(from = undefined) {
  const message =
    from === "lessons-calendar-wrapper"
      ? "Le calendrier actuel sera perdu"
      : "Vous ne pourrez modifier ces paramètres";
  if (
    !askConfirmation ||
    (askConfirmation && confirm(`${message}. Continuer?`))
  ) {
    generateLessonListAndBuildHtml();
  }
}
