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
