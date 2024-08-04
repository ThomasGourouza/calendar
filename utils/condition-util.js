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

function isLessonToShow(lesson, date, quarterTime, roomName, minTime) {
  return (
    lesson.date === date &&
    lesson.getQuarterIds(minTime).includes(quarterTime) &&
    lesson.roomName === roomName
  );
}

function isLessonToRemove(lesson, date, time, roomName) {
  return (
    lesson.date === date && lesson.time === time && lesson.roomName === roomName
  );
}
