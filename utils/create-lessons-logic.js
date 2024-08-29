function getLessons(dates, teachers, levels, numberDays, lessonDuration, selectedDates) {
  const finalLessonLists = [];
  for (let i = 0; i < 25; i++) {
    const list = createLessonList(
      randomOrder(dates),
      randomOrder(getCopyTeachers(teachers, levels)),
      randomOrder(getCopyLevels(levels)),
      lessonDuration,
      selectedDates
    );
    const score = getScoreForCalendarGeneration(list, teachers, selectedDates, numberDays, lessonDuration);
    finalLessonLists.push({list, score});
  }
  const maxScore = Math.max(...finalLessonLists.map(item => item.score));
  return finalLessonLists.find(item => item.score === maxScore).list;
}

function createLessonList(dates, teachers, levels, lessonDuration, selectedDates) {
    const finalLessonList = [];
    levels.forEach((level) => {
      const preferredTeachers = teachers.filter(t => t.preferedLevelNames.includes(level.name));
      if (preferredTeachers.length > 0) {
        const allAvailabilities = [];
        preferredTeachers.forEach(t => {
          allAvailabilities.push(...t.getAvailabilities(selectedDates));
        });
        const teacherAndAvailabilities = [];
        [...new Set(allAvailabilities)].forEach(date => {
          const teacherAndAvailability = {
            date,
            teachers: [],
          };
          preferredTeachers.forEach(t => {
            if (t.getAvailabilities(selectedDates).includes(date)) {
              teacherAndAvailability.teachers.push(t);
            }
          });
          teacherAndAvailabilities.push(teacherAndAvailability);
        });
        const uniqueOptions = teacherAndAvailabilities.filter(u => u.teachers.length === 1);
        const severalOptions = teacherAndAvailabilities.filter(u => u.teachers.length > 1);
        uniqueOptions.forEach((option) => {
          if (level.hours >= lessonDuration) {
            const availableTeachers = option.teachers.filter(t =>
              (!finalLessonList.filter((l) => l.date === option.date).map((l) => l.teacherName).includes(t.name)) &&
              (t.workingHours.max >= lessonDuration)
            );
            if (availableTeachers.length > 0) {
              const selectedTeacher = teachers.find(t => t.name === availableTeachers[0].name);
              level.hours -= lessonDuration;
              selectedTeacher.workingHours.max -= lessonDuration;
              selectedTeacher.workingHours.min -= lessonDuration;
              finalLessonList.push(
                new Lesson(option.date, selectedTeacher.name, level.name)
              );
            }
          }
        });
        severalOptions.forEach((option) => {
          if (level.hours >= lessonDuration) {
            const availableTeachers = option.teachers.filter(t =>
              (!finalLessonList.filter((l) => l.date === option.date).map((l) => l.teacherName).includes(t.name)) &&
              (t.workingHours.max >= lessonDuration)
            );
            if (availableTeachers.length > 0) {
              const selectedTeacher = chooseTeacher(
                teachers.filter(t => availableTeachers.map(at => at.name).includes(t.name)),
                finalLessonList,
                level
              );
              level.hours -= lessonDuration;
              selectedTeacher.workingHours.max -= lessonDuration;
              selectedTeacher.workingHours.min -= lessonDuration;
              finalLessonList.push(
                new Lesson(option.date, selectedTeacher.name, level.name)
              );
            }
          }
        });
      } else {
        dates.forEach((date) => {
          if (level.hours >= lessonDuration) {
            const availableTeachers = teachers.filter(t =>
              // dispo en principe ce jour
              (t.getAvailabilities(selectedDates).includes(date)) &&
              // ne travaille pas déjà ce jour
              (!finalLessonList.filter((l) => l.date === date).map((l) => l.teacherName).includes(t.name)) &&
              // a encore des heures
              (t.workingHours.max >= lessonDuration) &&
              // prof sans preference
              t.preferedLevelNames.length === 0
            );
            // Si prof dispo
            if (availableTeachers.length > 0) {
              const selectedTeacher = chooseTeacher(availableTeachers, finalLessonList, level);
              level.hours -= lessonDuration;
              selectedTeacher.workingHours.max -= lessonDuration;
              selectedTeacher.workingHours.min -= lessonDuration;
              finalLessonList.push(
                new Lesson(date, selectedTeacher.name, level.name)
              );
            }
          }
        });
      }
    });
    return finalLessonList;
}

function chooseTeacher(list, finalLessonList, level) {
  const priorityTeachers = list.filter(t => t.preferedLevelNames.length === 1);
  if (priorityTeachers.length > 0) {
    return minHoursLimitedTeacher(priorityTeachers, finalLessonList, level);
  }
  const priorityTeachers2 = list.filter(t => t.preferedLevelNames.length === 2);
  if (priorityTeachers2.length > 0) {
    return minHoursLimitedTeacher(priorityTeachers2, finalLessonList, level);
  }
  const priorityTeachers3 = list.filter(t => t.preferedLevelNames.length === 3);
  if (priorityTeachers3.length > 0) {
    return minHoursLimitedTeacher(priorityTeachers3, finalLessonList, level);
  }
  return minHoursLimitedTeacher(list, finalLessonList, level);
}

function minHoursLimitedTeacher(teacherList, finalLessonList, level) {
  const minHoursTeachears = teacherList.filter(t => t.workingHours.min > 0);
    if (minHoursTeachears.length > 0) {
      return limitedTeacher(minHoursTeachears, finalLessonList, level);
    } else {
      return limitedTeacher(teacherList, finalLessonList, level);
    }
}

function limitedTeacher(teacherList, finalLessonList, level) {
  const limitedminHoursTeachears1 = limited(teacherList, 1, finalLessonList, level);
    const limitedminHoursTeachears2 = limited(teacherList, 2, finalLessonList, level);
    const limitedminHoursTeachears3 = limited(teacherList, 3, finalLessonList, level);
    if (limitedminHoursTeachears1.length > 0) {
      return limitedminHoursTeachears1[0];
    }
    if (limitedminHoursTeachears2.length > 0) {
      return limitedminHoursTeachears2[0];
    }
    if (limitedminHoursTeachears3.length > 0) {
      return limitedminHoursTeachears3[0];
    }
    return teacherList[0];
}

function limited(list, limit, finalLessonList, level) {
  return list.filter(t => {
    const teacherLevels = [...new Set(finalLessonList.filter((l) => l.teacherName === t.name).map((l) => l.levelName))];
    const lTeachers = [...new Set(finalLessonList.filter((l) => l.levelName === level.name).map((l) => l.teacherName))];
    return (teacherLevels.includes(level.name) || teacherLevels.length < limit) && (lTeachers.includes(t.name) || lTeachers.length < limit);
  });
}
