function isLessonToShow(lesson, date, level) {
  return lesson.date === date && lesson.level == level;
}

function isLessonToRemove(lesson, date) {
  return lesson.date === date;
}
