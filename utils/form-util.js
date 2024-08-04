function setParameters(form, param) {
  param.lang = form.lang.value;
  param.minTime = +form.minTime.value;
  param.maxTime = +form.maxTime.value;
  param.minLunchTime = +form.minLunchTime.value;
  param.maxLunchTime = +form.maxLunchTime.value;
  param.minLessonTime = +form.minLessonTime.value;
  param.maxLessonTime = +form.maxLessonTime.value;
  param.maxDays = +form.maxDays.value;
  param.colorLessonBy = form.colorLessonBy.value;
  param.visibility = form.visibility.value;
  param.startDate = form.startDate.value;
  param.endDate = form.endDate.value;
}

function setForm(form, param) {
  form.minTime.value = param.minTime;
  form.maxTime.value = param.maxTime;
  form.minLunchTime.value = param.minLunchTime;
  form.maxLunchTime.value = param.maxLunchTime;
  form.minLessonTime.value = param.minLessonTime;
  form.maxLessonTime.value = param.maxLessonTime;
  form.maxDays.value = param.maxDays;
  form.colorLessonBy.value = param.colorLessonBy;
  form.visibility.value = param.visibility;
}

function validateCalendarForm(form) {
  const dateFrom = new Date(form.startDate.value);
  const dateTo = new Date(form.endDate.value);
  const maxDays = +form.maxDays.value;
  if (getDaysNumberBetween(dateFrom, dateTo) <= 0) {
    alert(`End date must be after the start date.`);
    return;
  }
  if (Math.abs(dateFrom - dateTo) / (1000 * 60 * 60 * 24) > maxDays - 1) {
    alert(`Not more than ${maxDays} days.`);
    return;
  }
}

function validateLessonForm(
  form,
  startDate,
  endDate,
  minLessonTime,
  maxLessonTime
) {
  if (!startDate || !endDate) {
    alert("Renseignez les dates du calendrier!");
    return;
  }
  const dateFrom = new Date(startDate);
  const dateTo = new Date(endDate);
  dateTo.setDate(dateTo.getDate() + 1);

  const lessonDate = new Date(`${form.date.value}T${form.startTime.value}:00`);
  const lessonDateEnd = new Date(`${form.date.value}T${form.endTime.value}:00`);

  if (lessonDate < dateFrom || lessonDate > dateTo) {
    // TODO: useless ?
    alert("invalid date");
    return;
  }
  if (lessonDateEnd < lessonDate) {
    // TODO
    alert("impossible");
    return;
  }
  if (
    Math.abs(lessonDate - lessonDateEnd) < minLessonTime * 60000 ||
    Math.abs(lessonDate - lessonDateEnd) > maxLessonTime * 60000
  ) {
    // TODO
    alert(
      `lesson should last between ${minLessonTime}min and ${maxLessonTime}min.`
    );
    return;
  }
}
