// les données à charger
let levels = [];
let rooms = [];
let teachers = [];
let lessons = [];
let translation = undefined;
let parameter = undefined;

// filtres des leçons
let lessonFilters = [];
// les quarts d'heures de la journée
let allQuarterTimes = [];
// dates sélectionnées
let selectedDates = [];

// les formulaires
const parameterForm = document.forms["parameter-form"];
const addLessonForm = document.forms["addLesson-form"];

document.addEventListener("DOMContentLoaded", function () {
  // load data and fill options in html template
  loadData("levels").then((data) => {
    levels = data;
    fillSelectOptions(
      "levels",
      levels.map((level) => level.name)
    );
  });
  loadData("rooms").then((data) => {
    rooms = data;
    fillSelectOptions(
      "rooms",
      rooms.map((room) => room.name)
    );
  });
  loadData("teachers").then((data) => {
    teachers = data;
    fillSelectOptions(
      "teachers",
      teachers.map((teacher) => teacher.name)
    );
  });

  // load parameter and init form with default parameters
  loadData("parameter").then((data) => {
    parameter = data;
    setForm(parameterForm, parameter);
  });

  // load lessons
  loadData("lessons").then((data) => (lessons = data));

  // créer la liste des leçons et le calendrier
  parameterForm.onsubmit = function (e) {
    e.preventDefault();
    validateCalendarForm(this);
    setParameters(this, parameter);
    allQuarterTimes = getQuarterTimes(parameter.minTime, parameter.maxTime);
    selectedDates = getSelectedDates(parameter.startDate, parameter.endDate);
    buildHtml();
    navigate("lessons-calendar-wrapper");
  };

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
        this.roomName.value,
        this.teacherName.value,
        this.levelName.value
      )
    );
    // reset filters
    lessonFilters = [];
    this.reset();
    buildHtml();
  };
});

// supprimer une leçon
function removeLesson(date, time, roomName) {
  lessons = lessons.filter(
    (lesson) => !isLessonToRemove(lesson, date, time, roomName)
  );
  buildHtml();
}

// selectionner une leçon
function highlightLesson(date, time, roomName) {
  const lesson = lessons.find((l) => isLessonToRemove(l, date, time, roomName));
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
  ["roomName", "teacherName", "levelName"].forEach((field) => {
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
    rooms,
    allQuarterTimes,
    highlightLesson,
    removeLesson
  );
}
