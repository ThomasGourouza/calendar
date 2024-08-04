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

function existingLesson(lessonList, date, quarterTime, roomName, minTime) {
  return lessonList.find(
    (l) =>
      l.date === date &&
      l.getQuarterIds(minTime).includes(quarterTime) &&
      l.roomName === roomName
  );
}

function matchLessonCondition(lesson, date, time, roomName) {
  return (
    lesson.date === date && lesson.time === time && lesson.roomName === roomName
  );
}
