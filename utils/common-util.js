function getSelectedDates(startDate, numberDays, bankHolidays) {
  const result = [];
  const dateFrom = new Date(startDate);
  const holidays = bankHolidays.map((d) => new Date(d));
  while (result.filter((d) => d.type === "regular").length < numberDays) {
    if (![0, 6].includes(dateFrom.getDay())) {
      if (holidays.some((d) => d.getTime() === dateFrom.getTime())) {
        result.push({
          date: new Date(dateFrom),
          type: "holiday",
        });
      } else {
        result.push({
          date: new Date(dateFrom),
          type: "regular",
        });
      }
    } else if (dateFrom.getDay() == 6) {
      result.push({
        date: null,
        type: "weekend",
      });
    }
    dateFrom.setDate(dateFrom.getDate() + 1);
  }
  return result;
}

function isLesson(lesson, date, levelName) {
  return lesson.date === date && lesson.levelName == levelName;
}

function setParameters(form, param) {
  param.startDate = form.startDate.value;
  param.numberDays = +form.numberDays.value;
  param.bankHolidays = form.bankHolidays.value.split(", ");
  param.lessonDuration = +form.lessonDuration.value;
}

function setForm(form, param, startDateInput, bankHolidaysInput) {
  startDateInput.setDate(param.startDate);
  bankHolidaysInput.setDate(param.bankHolidays);
  form.numberDays.value = param.numberDays;
  form.lessonDuration.value = param.lessonDuration;
}

function sort(lessonList) {
  function getComparableDate(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  }
  lessonList.sort((a, b) => {
    const dateA = getComparableDate(a.date);
    const dateB = getComparableDate(b.date);
    return dateA - dateB;
  });
  return lessonList;
}

function isValideHour(workingHours, lessonDuration, numberDays) {
  return (
    !!workingHours.min &&
    !!workingHours.max &&
    +workingHours.max <= lessonDuration * numberDays &&
    +workingHours.min >= lessonDuration &&
    +workingHours.min <= +workingHours.max &&
    +workingHours.min % lessonDuration === 0 &&
    +workingHours.max % lessonDuration === 0
  );
}

function existLesson(newLesson, lessons) {
  return lessons.some(
    (l) => l.date === newLesson.date && l.levelName === newLesson.levelName
  );
}

function capitalize(teacher) {
  if (!teacher) return teacher;
  return teacher.charAt(0).toUpperCase() + teacher.slice(1).toLowerCase();
}

function formatLevel(level) {
  return level.toLocaleLowerCase().includes("conv")
    ? capitalize(level)
    : level.toLocaleUpperCase();
}

function csvToArray(str, delimiter = ";") {
  const rows = str
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim()
    .split("\n");
  const headers = rows[0].split(delimiter);
  return rows.slice(1).map((row) => {
    const values = row.split(delimiter);
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i];
    });
    return obj;
  });
}

function checkData(file, nameList, data) {
  if (
    nameList.length < 0 ||
    nameList[1] !== "csv" ||
    !file.type.includes("csv")
  ) {
    alert("Ce type de fichier n'est pas pris en charge.");
    return false;
  }
  if (data.length < 0) {
    alert("Aucune donnée chargée.");
    return false;
  }
  return true;
}
function checkDataTeachersLevels(keys) {
  if (
    !keys.some((header) => header.toLocaleLowerCase().includes(colName1)) ||
    !keys.some((header) => header.toLocaleLowerCase().includes(colName2))
  ) {
    alert(`Nom de colonne incorrect. Correct: "${colName1}" et "${colName2}".`);
    return false;
  }
  return true;
}
function checkDataConstraints(keys) {
  if (keys.some((header) => !constraintsHeaders.includes(header))) {
    alert(
      `Nom de colonne incorrect. Correct: ${constraintsHeaders
        .map((h) => `"${h}"`)
        .join(", ")}.`
    );
    return false;
  }
  return true;
}

function isPerfect(teacherResults) {
  const allWorkingTeachers = teacherResults.notWorkingTeachers.length === 0;
  const allTeachersWorkFull = teacherResults.workingTeachers
    .map((t) => t.hours.color)
    .every((t) => t === "green");
  console.log(allWorkingTeachers && allTeachersWorkFull);
  return allWorkingTeachers && allTeachersWorkFull;
}

function getTeachers(teacherNames, constraints, levelNames) {
  if (teacherNames.length === 0) {
    return [];
  }
  const constraintsMapped = constraints.map((c) => ({
    name: c.name,
    workingHourMin: +c.workingHourMin,
    workingHourMax: +c.workingHourMax,
    recurrentDaysOff: c.recurrentDaysOff
      .split(",")
      .map((d) => `${getDayNumber(d)}`),
    daysOff: c.daysOff
      .split(",")
      .map((d) => toDateInput(d))
      .filter((d) => !d.includes("undefined")),
    preferedLevelNames: c.preferedLevelNames
      .split(",")
      .filter((n) => levelNames.includes(n)),
  }));
  return teacherNames.map((t, index) => {
    const color = colors[index % colors.length];
    const teacherConstraint = constraintsMapped.find(
      (c) => c.name.trim().toLocaleLowerCase() === t.trim().toLocaleLowerCase()
    );
    if (!teacherConstraint) {
      return new Teacher(t, color.backgroundColor, color.textColor);
    }
    return new Teacher(
      t,
      color.backgroundColor,
      color.textColor,
      teacherConstraint.workingHourMin,
      teacherConstraint.workingHourMax,
      teacherConstraint.recurrentDaysOff.filter(
        (d) => !d.includes("undefined")
      ),
      teacherConstraint.daysOff,
      teacherConstraint.preferedLevelNames,
      teacherConstraint.preferedLevelNames.length === 1
    );
  });
}

function colorCheck(color, type) {
  if (type === "hours") {
    if (color === "red") {
      return 1;
    }
    return 0;
  }
  switch (color) {
    case "green":
      return 2;
    case "orange":
      return 1;
    default:
      return 0;
  }
}
