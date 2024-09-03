function getLessons(dates, teachers, levels, lessonDuration, selectedDates, openDays) {
  const numberDays = dates.length;
  const finalLessonLists = [];
  for (let i = 0; i < 20; i++) {
    const list = createLessonList(
      randomOrder(dates),
      randomOrder(getCopyTeachers(teachers, levels)),
      randomOrder(getCopyLevels(levels)),
      lessonDuration,
      selectedDates
    );
    const score = getScoreForCalendarGeneration(list, teachers, selectedDates, numberDays, lessonDuration, openDays);
    finalLessonLists.push({list, score});
  }
  const maxScore = Math.max(...finalLessonLists.map(item => item.score));
  return finalLessonLists.find(item => item.score === maxScore).list;
}

function getTeachearsByLevels(levels, teachers, finalLessonList, lessonDuration) {
  const teachersByLevel = [];
    levels.forEach((level) => {
      const preferredTeachers = teachers.filter(t => t.preferedLevelNames.includes(level.name));
      if (preferredTeachers.length > 0) {
        const allAvailabilities = [];
        preferredTeachers.forEach(t => {
          const teacherLessons = finalLessonList.filter(l =>
            l.levelName === level.name && l.teacherName === t.name
          ).map(l => l.date);
          allAvailabilities.push(
            ...t.getAvailabilities(selectedDates).filter(a => !teacherLessons.includes(a))
          );
        });
        const teacherAndAvailabilities = [];
        [...new Set(allAvailabilities)].forEach(date => {
          const teacherAndAvailability = {
            date,
            teachers: [],
          };
          preferredTeachers.forEach(t => {
            if (t.getAvailabilities(selectedDates).includes(date) &&
            !finalLessonList.filter((l) => l.date === date).map((l) => l.teacherName).includes(t.name) &&
            t.workingHours.max >= lessonDuration) {
              teacherAndAvailability.teachers.push(t);
            }
          });
          if (teacherAndAvailability.teachers.length > 0) {
            teacherAndAvailabilities.push(teacherAndAvailability);
          }
        });
        if (teacherAndAvailabilities.length > 0) {
          teachersByLevel.push({
            level: level.name,
            teachers: teacherAndAvailabilities
          });
        }
      }
    });
    return teachersByLevel;
}

function pushInLessons(level, teachersByLevel, finalLessonList, teachers, lessonDuration, length) {
  const uniqueOptions = teachersByLevel.filter(u => length === 1 ? (u.teachers.length === 1) : (u.teachers.length > 1));
  uniqueOptions.forEach((option) => {
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
}

function createLessonList(dates, teachers, levels, lessonDuration, selectedDates) {
    const finalLessonList = [];
    // unique option
    while (getTeachearsByLevels(levels, teachers, finalLessonList, lessonDuration).some(tl => tl.teachers.some(t => t.teachers.length === 1))) {
      const teachersByLevel = getTeachearsByLevels(levels, teachers, finalLessonList, lessonDuration);
      levels.forEach((level) => {
        const teacherByLevel = teachersByLevel.filter(tl => tl.level === level.name);
        if (teacherByLevel.length > 0) {
          pushInLessons(level, teacherByLevel[0].teachers, finalLessonList, teachers, lessonDuration, 1);
        }
      });
    } 
    // several options
    const teachersByLevel = getTeachearsByLevels(levels, teachers, finalLessonList, lessonDuration);
    levels.forEach((level) => {
      const teacherByLevel = teachersByLevel.filter(tl => tl.level === level.name);
      if (teacherByLevel.length > 0) {
        pushInLessons(level, teacherByLevel[0].teachers, finalLessonList, teachers, lessonDuration, 2);
      }
    });
    // rest
    levels.forEach((level) => {
      dates.forEach((date) => {
        if (level.hours >= lessonDuration) {
          const availableTeachers = teachers.filter(t =>
            // il n'y a pas déjà de cours ce jour
            (finalLessonList.filter((l) => l.date === date && l.levelName === level.name).length === 0) &&
            // prof dispo en principe ce jour
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
