const dateFormat = "Y-m-d";
flatpickr("#startDate", {
  dateFormat,
});
flatpickr("#bankHolidays", {
  mode: "multiple",
  dateFormat,
});

// dates sélectionnées
let selectedDates = [];
let teacherConditions = [];
let levelsWithHours = [];
let lessons = [];

// les formulaires
const parameterForm = document.forms["parameter-form"];
const addLessonForm = document.forms["addLesson-form"];
fillSelectOptions(
  "levels",
  levels.map((level) => level.name)
);
fillSelectOptions(
  "teachers",
  teachers.map((teacher) => teacher.name)
);
// load parameter and init form with default parameters
setForm(parameterForm, parameter);

// créer la liste des professeurs
parameterForm.onsubmit = function (e) {
  e.preventDefault();
  if (!parameterForm.startDate.value) {
    alert("Date de début!");
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
  buildHtmlConditions(
    teachers,
    levels,
    printDateFull(firstDate),
    printDateFull(lastDate),
    parameter.lessonDuration,
    parameter.numberDays
  );
  navigate("conditions-wrapper");
};

// ajouter une leçon
addLessonForm.onsubmit = function (e) {
  e.preventDefault();
  // TODO: verifier que la leçon n'est pas en conflit avec une autre: validateLessonForm();
  // create lesson
  lessons.push(
    new Lesson(
      getLessonDate(this.date.value),
      this.teacherName.value,
      this.levelName.value
    )
  );
  this.reset();
  buildHtml();
};

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

function generateTeacherAndLevelConditions() {
  teacherConditions = teachers.map((teacher) => ({
    name: teacher.name,
    workingHours: teacher.workingHours,
    availabilities: teacher.getAvailabilities(selectedDates),
    preferedLevelNames: teacher.preferedLevelNames,
  }));
  levelsWithHours = levels.filter((level) => !!level.hours);
  if (
    isValide(
      teacherConditions.map(
        (teacherCondition) => teacherCondition.workingHours
      ),
      levelsWithHours
    )
  ) {
    if (levelsWithHours.length > 0) {
      buildHtmlConfirmations(teacherConditions, levelsWithHours);
      navigate("confirmation-wrapper");
    } else {
      alert("Aucun niveau ne possède d'heure.");
      return;
    }
  } else {
    alert("Volume horaire incorrect.");
    return;
  }
}

// créer la liste des leçons et le calendrier
function generateLessonListAndBuildHtml() {
  const dates = selectedDates
    .filter((d) => d.type === "regular")
    .map((d) => getDateTextFromLocalDate(d.date));
  lessons = getLessonList(
    dates,
    teacherConditions.map((x) => ({ ...x })),
    levelsWithHours.map((x) => ({ ...x })),
    parameter.lessonDuration
  );
  buildHtml();
  navigate("lessons-calendar-wrapper");
}

// changer de section
function navigate(page) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  document.getElementById(page).style.display = "block";
}

// créer la liste des leçons et le calendrier
function buildHtml() {
  return buildHtmlLessonListAndCalendar(
    lessons,
    selectedDates,
    teachers,
    highlightLesson,
    removeLesson
  );
}
