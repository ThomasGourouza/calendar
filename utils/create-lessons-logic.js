function getLessonList(dates, teachers, levels, numberDays, lessonDuration, selectedDates) {
  const results = [];
  let result;
  for (let i = 0; i < 10; i++) {
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
    const teacherResults = getTeacherResults(
      teachers,
      selectedDates,
      numberDays,
      lessonDuration,
      finalLessonList
    );
    result = {
      lessons: [...finalLessonList],
      teacherResults
    };
    results.push(result);
    if(isPerfect(result.teacherResults)) {
      return result.lessons
    }
  }
  const notWorkingTeachersMinLength = Math.min(...results.map(r => r.teacherResults.notWorkingTeachers.length));
  const mappedResults = results.filter(r => r.teacherResults.notWorkingTeachers.length === notWorkingTeachersMinLength)
    .map(r => ({
      lessons: r.lessons,
      redHoursNumber: r.teacherResults.workingTeachers.map((tr) => colorCheck(tr.hours.color, "hours")).reduce((acc, currentVal) => acc + currentVal, 0),
      score: r.teacherResults.workingTeachers.map((tr) => colorCheck(tr.levels.color, "levels")).reduce((acc, currentVal) => acc + currentVal, 0),
    }));
  
  const mappedResultsMinRed = Math.min(...mappedResults.map(r => r.redHoursNumber));
  const mappedResultsFiltered = mappedResults.filter(r => r.redHoursNumber === mappedResultsMinRed);
  const mappedResultsMaxScore = Math.max(...mappedResultsFiltered.map(r => r.score));
  const mappedResultsMaxScoreFiltered = mappedResultsFiltered.filter(r => r.score === mappedResultsMaxScore)
    .map(r => r.lessons);
  return mappedResultsMaxScoreFiltered[0];
}

function createLessonList(dates, teachers, levels, lessonDuration, selectedDates) {
  const finalLessonList = [];
  dates.forEach((date) => {
    levels.forEach((level) => {
      if (level.hours >= lessonDuration) {
        const availableTeachers = teachers.filter(t =>
          // dispo en principe ce jour
          (t.getAvailabilities(selectedDates).includes(date)) &&
          // ne travaille pas déjà ce jour
          (!finalLessonList.filter((l) => l.date === date).map((l) => l.teacherName).includes(t.name)) &&
          // a encore des heures
          (t.workingHours.max >= lessonDuration)
        );
        let selectedTeacher;
        // Si prof dispo
        if (availableTeachers.length > 0) {
          const preferredAvailableTeachers = availableTeachers.filter(t => t.preferedLevelNames.includes(level.name));
          // Si prof prefere ce niveau
          if (preferredAvailableTeachers.length > 0) {
            // on en choisi un
            selectedTeacher = chooseTeacher(randomOrder(preferredAvailableTeachers), finalLessonList, level);
          // Si aucun prof ne prefere ce niveau
          } else {
            const noPreferAvailableTeachers = availableTeachers.filter(t => t.preferedLevelNames.length === 0);
            // Si prof sans preference
            if (noPreferAvailableTeachers.length > 0) {
              // on en choisi un
              selectedTeacher = chooseTeacher(randomOrder(noPreferAvailableTeachers), finalLessonList, level);
            }
          }
        }

        if (!!selectedTeacher) {
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

function randomOrder(list) {
  return list.sort(() => Math.random() - 0.5);
}
