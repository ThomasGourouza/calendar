function getLessonList(dates, teachers, levels, lessonDuration, selectedDates) {
  const finalLessonLists = [];
  for (let i = 0; i < 50; i++) {
    const teacherListCopy = teachers.map(
      (t) =>
        new Teacher(
          t.name,
          t.backgroundColor,
          t.textColor,
          t.workingHours.min,
          t.workingHours.max,
          t.recurrentDaysOff,
          t.daysOff,
          t.preferedLevelNames.filter((n) =>
            levels
              .filter((l) => l.active)
              .map((l) => l.name)
              .includes(n)
          ),
          t.priority
        )
    );
    const levelListCopy = levels.filter((l) => l.active).map((l) => new Level(l.name, l.active));
    const finalLessonList = createLessonList(dates, teacherListCopy, levelListCopy, lessonDuration, selectedDates);
    finalLessonLists.push(finalLessonList);
  }
  const lengths = finalLessonLists.map(list => list.length);
  const maxLength = Math.max(...lengths);
  return finalLessonLists.find(l => l.length === maxLength);
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
                randomOrder(teachers.filter(t => availableTeachers.map(at => at.name).includes(t.name))),
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
              const selectedTeacher = chooseTeacher(randomOrder(availableTeachers), finalLessonList, level);
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

function randomOrder(list) {
  return list.sort(() => Math.random() - 0.5);
}
