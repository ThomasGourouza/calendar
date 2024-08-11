function filterAndSort(lessonList, visibility, startDate, endDate, filters) {
  return sort(filter(lessonList, visibility, startDate, endDate, filters));
}

function sort(lessonList) {
  function getComparableDateTime(dateStr, timeStr) {
    const [day, month, year] = dateStr.split("/");
    const [startTime] = timeStr.split("-");
    return new Date(`${year}-${month}-${day}T${startTime}:00`);
  }
  lessonList.sort((a, b) => {
    const dateTimeA = getComparableDateTime(a.date, a.time);
    const dateTimeB = getComparableDateTime(b.date, b.time);
    return dateTimeA - dateTimeB;
  });
  return lessonList;
}

function filter(lessonList, visibility, startDate, endDate, filters) {
  let newLessonList = [...lessonList];
  if (visibility === "selected") {
    const minDate = new Date(startDate);
    const maxDate = new Date(endDate);
    minDate.setDate(minDate.getDate() - 1);
    newLessonList = newLessonList.filter(
      (lesson) => lesson.localDate >= minDate && lesson.localDate <= maxDate
    );
  }
  if (filters.length > 0) {
    filters.forEach((filter) => {
      newLessonList = newLessonList.filter(
        (lesson) => lesson[filter.field] === filter.value
      );
    });
  }
  return newLessonList;
}
