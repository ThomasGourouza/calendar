function getLessonList(dates, tConditions, levelsHours, lessonDuration) {
  const finalLessonList = [];
  dates.forEach((date) => {
    levelsHours.forEach((level) => {
      if (level.hours >= lessonDuration) {
        const preferredTeacher = randomOrder(tConditions).find((t) => {
          const teacherLevels = [
            ...new Set(
              finalLessonList
                .filter((l) => l.teacherName === t.name)
                .map((l) => l.levelName)
            ),
          ];
          const lTeachers = [
            ...new Set(
              finalLessonList
                .filter((l) => l.levelName === level.name)
                .map((l) => l.teacherName)
            ),
          ];
          return (
            (!t.workingHours.max ||
              (!!t.workingHours.max && t.workingHours.max >= lessonDuration)) &&
            t.availabilities.includes(date) &&
            (t.preferedLevelNames.length === 0 ||
              t.preferedLevelNames.includes(level.name)) &&
            !finalLessonList
              .filter((l) => l.date === date)
              .map((l) => l.teacherName)
              .includes(t.name) &&
            (teacherLevels.includes(level.name) || teacherLevels.length < 3) &&
            (lTeachers.includes(t.name) || lTeachers.length < 3)
          );
        });
        if (!!preferredTeacher) {
          level.hours -= lessonDuration;
          preferredTeacher.workingHours.max -= lessonDuration;
          finalLessonList.push(
            new Lesson(date, preferredTeacher.name, level.name)
          );
        } else {
          const randomTeacher = randomOrder(tConditions).find((t) => {
            const teacherLevels = [
              ...new Set(
                finalLessonList
                  .filter((l) => l.teacherName === t.name)
                  .map((l) => l.levelName)
              ),
            ];
            const lTeachers = [
              ...new Set(
                finalLessonList
                  .filter((l) => l.levelName === level.name)
                  .map((l) => l.teacherName)
              ),
            ];
            return (
              (!t.workingHours.max ||
                (!!t.workingHours.max &&
                  t.workingHours.max >= lessonDuration)) &&
              t.availabilities.includes(date) &&
              !finalLessonList
                .filter((l) => l.date === date)
                .map((l) => l.teacherName)
                .includes(t.name) &&
              (teacherLevels.includes(level.name) ||
                teacherLevels.length < 3) &&
              (lTeachers.includes(t.name) || lTeachers.length < 3)
            );
          });
          if (!!randomTeacher) {
            level.hours -= lessonDuration;
            randomTeacher.workingHours.max -= lessonDuration;
            finalLessonList.push(
              new Lesson(date, randomTeacher.name, level.name)
            );
          } else {
            const overWorkingTeacher = randomOrder(tConditions).find((t) => {
              const teacherLevels = [
                ...new Set(
                  finalLessonList
                    .filter((l) => l.teacherName === t.name)
                    .map((l) => l.levelName)
                ),
              ];
              const lTeachers = [
                ...new Set(
                  finalLessonList
                    .filter((l) => l.levelName === level.name)
                    .map((l) => l.teacherName)
                ),
              ];
              return (
                t.availabilities.includes(date) &&
                !finalLessonList
                  .filter((l) => l.date === date)
                  .map((l) => l.teacherName)
                  .includes(t.name) &&
                (teacherLevels.includes(level.name) ||
                  teacherLevels.length < 3) &&
                (lTeachers.includes(t.name) || lTeachers.length < 3)
              );
            });
            if (!!overWorkingTeacher) {
              level.hours -= lessonDuration;
              overWorkingTeacher.workingHours.max -= lessonDuration;
              finalLessonList.push(
                new Lesson(date, overWorkingTeacher.name, level.name)
              );
            } else {
              const lastChoiceTeacher = randomOrder(tConditions).find(
                (t) =>
                  t.availabilities.includes(date) &&
                  !finalLessonList
                    .filter((l) => l.date === date)
                    .map((l) => l.teacherName)
                    .includes(t.name)
              );
              if (!!lastChoiceTeacher) {
                level.hours -= lessonDuration;
                lastChoiceTeacher.workingHours.max -= lessonDuration;
                finalLessonList.push(
                  new Lesson(date, lastChoiceTeacher.name, level.name)
                );
              }
            }
          }
        }
      }
    });
  });
  return finalLessonList;
}

function randomOrder(list) {
  return list.sort(() => Math.random() - 0.5);
}
