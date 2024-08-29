function getSelectedDates(startDate, numberDays, bankHolidays, openDays) {
  const result = [];
  const dateFrom = new Date(startDate);
  const holidays = bankHolidays.map((d) => new Date(d));
  while (result.filter((d) => d.type === "regular").length < numberDays) {
    if (
      openDays
        .filter((d) => d.active)
        .map((d) => d.day)
        .includes(dateFrom.getDay())
    ) {
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
    } else if (![0, 6].includes(dateFrom.getDay())) {
      result.push({
        date: new Date(dateFrom),
        type: "closed",
      });
    }
    if (dateFrom.getDay() == 0) {
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

function getTeachers(teacherNames, constraints, levelNames, parameter) {
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
      return new Teacher(
        t,
        color.backgroundColor,
        color.textColor,
        parameter.lessonDuration,
        parameter.lessonDuration * parameter.numberDays
      );
    }
    const recDaysOff = teacherConstraint.recurrentDaysOff.filter(
      (d) => !d.includes("undefined")
    ).map(d => +d);
    return new Teacher(
      t,
      color.backgroundColor,
      color.textColor,
      teacherConstraint.workingHourMin,
      teacherConstraint.workingHourMax,
      recDaysOff,
      teacherConstraint.daysOff,
      teacherConstraint.preferedLevelNames
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

function getScore(teacherResults, teachers, groupedTeachers, lessonDuration) {
  const ponderateNotWorkingTeachers = teacherResults.notWorkingTeachers.map(
    (t) => {
      const matchingTeacher = teachers.find((mt) => mt.name === t);
      return {
        name: t,
        hours: matchingTeacher.workingHours.min / lessonDuration,
      };
    }
  );
  let problemNumber = teacherResults.notWorkingTeachers.length;
  let total = problemNumber * 4;
  let negativePoints = ponderateNotWorkingTeachers
    .map((pt) => 3 + pt.hours)
    .reduce((acc, currVal) => acc + currVal, 0);
  teacherResults.workingTeachers.forEach((t) => {
    const currentTheoryTeacher = teachers.find(
      (ct) => ct.name === t.teacherName
    );
    const currentActualTeacher = Object.entries(groupedTeachers).find(
      (gt) => gt[0] === t.teacherName
    )[1];
    total += 4;
    if (t.daysOff.workDuringTimeOff.true) {
      const counter = currentActualTeacher
        .map((t) => toDateInput(t.date))
        .filter((d) => currentTheoryTeacher.daysOff.includes(d)).length;
      negativePoints += counter;
      problemNumber += 1;
    }
    if (t.recurrentDaysOff.workDuringTimeOff.true) {
      const recDayOffWorkCounter = currentActualTeacher
        .map((t) => new Date(toDateInput(t.date)))
        .filter((d) =>
          currentTheoryTeacher.recurrentDaysOff
            .map((d) => +d)
            .includes(d.getDay())
        ).length;
      negativePoints += recDayOffWorkCounter;
      problemNumber += 1;
    }
    if (t.hours.color !== "green") {
      let difference = 0;
      const actualHoursNumber = currentActualTeacher.length * lessonDuration;
      if (
        currentTheoryTeacher.workingHours.min ===
          currentTheoryTeacher.workingHours.max ||
        actualHoursNumber < currentTheoryTeacher.workingHours.min
      ) {
        difference =
          Math.abs(actualHoursNumber - currentTheoryTeacher.workingHours.min) /
          lessonDuration;
      } else {
        difference =
          Math.abs(actualHoursNumber - currentTheoryTeacher.workingHours.max) /
          lessonDuration;
      }
      negativePoints += difference;
      problemNumber += 1;
    }
    if (t.levels.color !== "green") {
      const notPrefferedLevelsNumber = [
        ...new Set(currentActualTeacher.map((t) => t.levelName)),
      ].filter(
        (l) => !currentTheoryTeacher.preferedLevelNames.includes(l)
      ).length;
      negativePoints += notPrefferedLevelsNumber;
      problemNumber += 1;
    }
  });
  let score = Math.round(((total - negativePoints) * 100) / total);
  if (score < 0) {
    score = 0;
  }
  return {
    score,
    problemNumber,
  };
}

function getCopyTeachers(teachers, levels) {
  return teachers.map(
    (t) =>
      new Teacher(
        t.name,
        t.backgroundColor,
        t.textColor,
        t.workingHours.min,
        t.workingHours.max,
        t.recurrentDaysOff,
        t.daysOff,
        t.preferedLevelNames.filter((n) =>
          levels
            .filter((l) => l.active)
            .map((l) => l.name)
            .includes(n)
        )
      )
  );
}

function getCopyLevels(levels) {
  return levels.filter((l) => l.active).map((l) => new Level(l.name, l.hours, l.active));
}

function randomOrder(list) {
  return list.sort(() => Math.random() - 0.5);
}

function getGroupedTeachers(lessons) {
  return lessons.reduce((acc, item) => {
    const { teacherName, date, levelName } = item;
    if (!acc[teacherName]) {
      acc[teacherName] = [];
    }
    acc[teacherName].push({ date, levelName });
    return acc;
  }, {});
}

function getScoreForCalendarGeneration(
  lessons,
  teachers,
  selectedDates,
  numberDays,
  lessonDuration,
  openDays
) {
  const lessonLevelNames = [...new Set(lessons.map((l) => l.levelName))];
  const groupedTeachers = getGroupedTeachers(lessons);
  const teacherResults = getTeacherResults(
    teachers,
    selectedDates,
    numberDays,
    lessonDuration,
    lessonLevelNames,
    groupedTeachers,
    openDays
  );
  return getScore(teacherResults, teachers, groupedTeachers, lessonDuration)
    .score;
}
