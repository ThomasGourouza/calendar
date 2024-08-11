function isLunchTime(quarterTimeId, minTime, minLunchTime, maxLunchTime) {
  const minLunchTimeText = `${Math.floor(minLunchTime)}:${
    (minLunchTime - Math.floor(minLunchTime)) * 60
  }`;
  const maxLunchTimeText = `${Math.floor(maxLunchTime)}:${
    (maxLunchTime - Math.floor(maxLunchTime)) * 60
  }`;
  return (
    quarterTimeId >= getQuarterIdFromStartTime(minLunchTimeText, minTime) &&
    quarterTimeId <= getQuarterIdFromEndTime(maxLunchTimeText, minTime)
  );
}

function isLessonToShow(lesson, date, quarterTime, minTime) {
  return (
    lesson.date === date &&
    lesson.getQuarterIds(minTime).includes(quarterTime)
  );
}

function isLessonToRemove(lesson, date, time) {
  return (
    lesson.date === date && lesson.time === time
  );
}
