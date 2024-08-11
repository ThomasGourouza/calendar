function setParameters(form, param) {
  param.lessonDuration = +form.lessonDuration.value;
  param.numberDays = +form.numberDays.value;
  param.startDate = form.startDate.value;
}

function setForm(form, param) {
  form.lessonDuration.value = param.lessonDuration;
  form.numberDays.value = param.numberDays;
  form.startDate.value = param.startDate;
}
