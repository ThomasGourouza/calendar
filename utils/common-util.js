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

function setForm(form, param) {
  form.startDate.value = param.startDate;
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
    +workingHours.min <= +workingHours.max
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

function checkData(file, nameList, data, keys) {
  if (
    nameList.length < 0 ||
    nameList[1] !== "csv" ||
    !file.type.includes("csv")
  ) {
    alert("Ce type de fichier n'est pas pris en charge.");
    return;
  }
  if (data.length < 0) {
    alert("Aucune donnée chargée.");
    return;
  }
  if (keys.length < 2) {
    alert("Aucune donnée chargée.");
    return;
  }
  if (
    !keys.some((header) => header.toLocaleLowerCase().includes(colName1)) ||
    !keys.some((header) => header.toLocaleLowerCase().includes(colName2))
  ) {
    alert("Nom de colonne incorrect.");
    return;
  }
}
