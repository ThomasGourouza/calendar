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
fillSelectOptions("levels", levelNames);
fillSelectOptions(
  "teachers",
  teachers.map((teacher) => teacher.name)
);
// load parameter and init form with default parameters
setForm(parameterForm, parameter);

// créer la liste des parametres pour les professeurs et les niveaux
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
  levelsWithHours = levelNames.map((l) => new Level(l, parameter));
  buildHtmlTeachersConditions(
    teachers,
    levelNames,
    printDateFull(firstDate),
    printDateFull(lastDate),
    parameter.lessonDuration,
    parameter.numberDays
  );
  document.getElementById("levels-checkbox").checked = true;
  buildHtmlLevelsConditions(levelsWithHours);
  navigate("conditions-wrapper");
};

function selectOrUnselectAll(value) {
  levelsWithHours.forEach((l) => (l.active = value));
  buildHtmlLevelsConditions(levelsWithHours);
}

// ajouter une leçon
addLessonForm.onsubmit = function (e) {
  e.preventDefault();
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
  if (
    isValide(
      teacherConditions.map((teacherCondition) => teacherCondition.workingHours)
    )
  ) {
    if (levelsWithHours.some((l) => l.active)) {
      buildHtmlConfirmations(
        teacherConditions,
        levelsWithHours.filter((l) => l.active)
      );
      navigate("confirmation-wrapper");
    } else {
      alert("Aucun niveau sélectionné.");
      return;
    }
  } else {
    const teachers = teacherConditions
      .filter(
        (t) =>
          !!t.workingHours.min &&
          !!t.workingHours.max &&
          +t.workingHours.min > +t.workingHours.max
      )
      .map((t) => t.name)
      .join(", ")
      .replace(/, ([^,]*)$/, " et $1");
    alert(`Volume horaire incorrect pour ${teachers}`);
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
    levelsWithHours.filter((l) => l.active).map((x) => ({ ...x })),
    parameter.lessonDuration
  );
  buildHtml();
  navigate("lessons-calendar-wrapper");
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

// changer de section
function navigate(page) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  document.getElementById(page).style.display = "block";
}
