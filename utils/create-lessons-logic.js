function getLessonList(
  selectedDates,
  teacherConditions,
  levelsWithHours,
  lessonDuration
) {
  const finalLessonList = [];
  selectedDates.forEach((date) => {
    levelsWithHours.forEach((level) => {
      if (level.hours >= lessonDuration) {
        const preferredTeacher = randomOrder(teacherConditions).find(
          (t) =>
            (!t.workingHours.max ||
              (!!t.workingHours.max && t.workingHours.max >= lessonDuration)) &&
            t.availabilities.includes(date) &&
            (t.preferedLevelNames.length === 0 ||
              t.preferedLevelNames.includes(level.name)) &&
            !finalLessonList
              .filter((l) => l.date === date)
              .map((l) => l.teacherName)
              .includes(t.name)
        );
        if (!!preferredTeacher) {
          level.hours -= lessonDuration;
          preferredTeacher.workingHours.max -= lessonDuration;
          finalLessonList.push(
            new Lesson(date, preferredTeacher.name, level.name)
          );
        } else {
          const randomTeacher = randomOrder(teacherConditions).find(
            (t) =>
              (!t.workingHours.max ||
                (!!t.workingHours.max &&
                  t.workingHours.max >= lessonDuration)) &&
              t.availabilities.includes(date) &&
              !finalLessonList
                .filter((l) => l.date === date)
                .map((l) => l.teacherName)
                .includes(t.name)
          );
          if (!!randomTeacher) {
            level.hours -= lessonDuration;
            randomTeacher.workingHours.max -= lessonDuration;
            finalLessonList.push(
              new Lesson(date, randomTeacher.name, level.name)
            );
          } else {
            const overWorkingTeacher = randomOrder(teacherConditions).find(
              (t) =>
                t.availabilities.includes(date) &&
                !finalLessonList
                  .filter((l) => l.date === date)
                  .map((l) => l.teacherName)
                  .includes(t.name)
            );
            if (!!overWorkingTeacher) {
              level.hours -= lessonDuration;
              overWorkingTeacher.workingHours.max -= lessonDuration;
              finalLessonList.push(
                new Lesson(date, overWorkingTeacher.name, level.name)
              );
            }
          }
        }
      }
    });
  });
  // console.log(teacherConditions);
  // console.log(levelsWithHours);
  return finalLessonList;
}

function randomOrder(list) {
  return list.sort(() => Math.random() - 0.5);
}
