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
