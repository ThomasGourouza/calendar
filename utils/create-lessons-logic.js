function getLessonList(dates, teachers, levels, lessonDuration, selectedDates) {
  const finalLessonList = [];
  randomOrder(dates).forEach((date) => {
    randomOrder(levels).forEach((level) => {
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
            // Si aucun prof sans preference
            } else {
              // on en choisi un au hasard
              selectedTeacher = chooseTeacher(randomOrder(availableTeachers), finalLessonList, level);
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
  const priorityTeachers = list.filter(t => t.workingHours.min > 0);
  if (priorityTeachers.length > 0) {
    const limitedPriorityTeachers1 = limited(priorityTeachers, 1, finalLessonList, level);
    const limitedPriorityTeachers2 = limited(priorityTeachers, 2, finalLessonList, level);
    const limitedPriorityTeachers3 = limited(priorityTeachers, 3, finalLessonList, level);
    if (limitedPriorityTeachers1.length > 0) {
      return limitedPriorityTeachers1[0];
    }
    if (limitedPriorityTeachers2.length > 0) {
      return limitedPriorityTeachers2[0];
    }
    if (limitedPriorityTeachers3.length > 0) {
      return limitedPriorityTeachers3[0];
    }
    return priorityTeachers[0];
  } else {
    const limitedTeachers1 = limited(list, 1, finalLessonList, level);
    const limitedTeachers2 = limited(list, 2, finalLessonList, level);
    const limitedTeachers3 = limited(list, 3, finalLessonList, level);
    if (limitedTeachers1.length > 0) {
      return limitedTeachers1[0];
    }
    if (limitedTeachers2.length > 0) {
      return limitedTeachers2[0];
    }
    if (limitedTeachers3.length > 0) {
      return limitedTeachers3[0];
    }
    return list[0];
  }
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
