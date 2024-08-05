// les formulaires
const calendarForm = document.forms["calendar-form"];
const addLessonForm = document.forms["addLesson-form"];

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
fetch('data/levels.json')
  .then(response => response.json())
  .then(data => console.log(data));


// filtre des leçons
let lessonFilters = [];

// les quarts d'heures de la journée
let allQuarterTimes = [];

// dates sélectionnées
let selectedDates = [];

// paramètres par défault
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
  startDate: "",
  endDate: "",
};

document.addEventListener("DOMContentLoaded", function () {
  // fill options in html template
  fillSelectOptions(
    "roomNames",
    rooms.map((room) => room.name)
  );
  fillSelectOptions(
    "levelNames",
    levels.map((level) => level.name)
  );
  fillSelectOptions(
    "teacherNames",
    teachers.map((teacher) => teacher.name)
  );

  // initialiser le formulaire avec les paramètres par défault
  setForm(calendarForm, parameter);
  // créer la liste des leçons et le calendrier
  calendarForm.onsubmit = function (e) {
    e.preventDefault();
    validateCalendarForm(this);
    setParameters(this, parameter);
    allQuarterTimes = getQuarterTimes(parameter.minTime, parameter.maxTime);
    selectedDates = getSelectedDates(parameter.startDate, parameter.endDate);
    buildHtml();
    navigate('lessons-calendar-wrapper');
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
