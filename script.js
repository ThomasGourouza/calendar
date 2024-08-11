// les données à charger
// if JSON: let levels = [];
// if JSON: let teachers = [];
// if JSON: let lessons = [];
// if JSON: let translation = undefined;
// if JSON: let parameter = undefined;

// filtres des leçons
let lessonFilters = [];
// les quarts d'heures de la journée
let allQuarterTimes = [];
// dates sélectionnées
let selectedDates = [];

// les formulaires
const parameterForm = document.forms["parameter-form"];
const addLessonForm = document.forms["addLesson-form"];

// load lessons and map to model
// if JSON: loadData("lessons").then(
// if JSON:   (data) =>
// if JSON:     (lessons = data.map(
// if JSON:       (l) => new Lesson(l.date, l.time, l.teacherName, l.levelName)
// if JSON:     ))
// if JSON: );
// load translations
// if JSON: loadData("translation", "translations").then((data) => (translation = data));

// load data and fill options in html template
// if JSON: loadData("levels").then((data) => {
// if JSON: levels = data;
fillSelectOptions(
  "levels",
  levels.map((level) => level.name)
);
// if JSON: });
// if JSON: loadData("teachers").then((data) => {
// if JSON: teachers = data;
fillSelectOptions(
  "teachers",
  teachers.map((teacher) => teacher.name)
);
// if JSON: });
// load parameter and init form with default parameters
// if JSON: loadData("parameter").then((data) => {
// if JSON: parameter = data;
setForm(parameterForm, parameter);
// if JSON: });

// créer la liste des leçons et le calendrier
// see calendar: parameterForm.onsubmit = function (e) {
// see calendar:   e.preventDefault();
// see calendar:   validateCalendarForm(this);
// see calendar:   setParameters(this, parameter);
  allQuarterTimes = getQuarterTimes(parameter.minTime, parameter.maxTime);
  selectedDates = getSelectedDates(parameter.startDate, parameter.endDate);
  buildHtml();
  navigate("lessons-calendar-wrapper");
// see calendar: };
// ajouter une leçon
addLessonForm.onsubmit = function (e) {
  e.preventDefault();
  validateLessonForm(
    this,
    parameter.startDate,
    parameter.endDate,
    parameter.minLessonTime,
    parameter.maxLessonTime
  );
  // create lesson
  lessons.push(
    new Lesson(
      getLessonDate(this.date.value),
      getLessonTime(this.startTime.value, this.endTime.value),
      this.teacherName.value,
      this.levelName.value
    )
  );
  // reset filters
  lessonFilters = [];
  this.reset();
  buildHtml();
};

// supprimer une leçon
function removeLesson(date, time) {
  lessons = lessons.filter(
    (lesson) => !isLessonToRemove(lesson, date, time)
  );
  buildHtml();
}

// selectionner une leçon
function highlightLesson(date, time) {
  const lesson = lessons.find((l) => isLessonToRemove(l, date, time));
  if (!!lesson) {
    const previousHighlight = lesson.highlight;
    // reset all
    lessons.forEach((lesson) => (lesson.highlight = false));
    // set new
    lesson.highlight = !previousHighlight;
    buildHtml();
  }
}

// filtrer les leçons
function filterLessons() {
  const startDateValue = parameter.startDate;
  const endDateValue = parameter.endDate;
  if (!startDateValue || !endDateValue) {
    alert("Renseignez les dates du calendrier!");
    return;
  }
  lessonFilters = [];
  ["teacherName", "levelName"].forEach((field) => {
    const value = addLessonForm[field].value;
    if (!!value) {
      lessonFilters.push({ field, value });
    }
  });
  buildHtml();
}

// changer de section
function navigate(page) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  document.getElementById(page).style.display = "block";
}

function buildHtml() {
  return buildHtmlLessonListAndCalendar(
    addLessonForm,
    lessons,
    parameter.startDate,
    parameter.endDate,
    parameter.visibility,
    parameter.colorLessonBy,
    parameter.lang,
    parameter.minTime,
    parameter.minLunchTime,
    parameter.maxLunchTime,
    lessonFilters,
    selectedDates,
    allQuarterTimes,
    highlightLesson,
    removeLesson
  );
}
