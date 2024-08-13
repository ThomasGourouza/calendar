function getLessonList(dates, tConditions, levelsHours, lessonDuration) {
  const finalLessonList = [];
  randomOrder(dates).forEach((date) => {
    randomOrder(levelsHours).forEach((level) => {
      if (level.hours >= lessonDuration) {
        const availableTeachers = tConditions.filter(t =>
          (t.availabilities.includes(date)) && (!finalLessonList.filter((l) => l.date === date).map((l) => l.teacherName).includes(t.name))
        );
        const availableLimitedTeachers = availableTeachers.filter(t => {
          const teacherLevels = [...new Set(finalLessonList.filter((l) => l.teacherName === t.name).map((l) => l.levelName))];
          const lTeachers = [...new Set(finalLessonList.filter((l) => l.levelName === level.name).map((l) => l.teacherName))];
          return (teacherLevels.includes(level.name) || teacherLevels.length < 3) && (lTeachers.includes(t.name) || lTeachers.length < 3);
        });

        const exactLimitedTeachers = availableLimitedTeachers.filter(t => !!t.workingHours.min && (t.workingHours.min === t.workingHours.max) && (t.workingHours.max >= lessonDuration));
        const minLimitedTeachers = availableLimitedTeachers.filter(t => !!t.workingHours.min && !t.workingHours.max && (t.workingHours.min >= 0));
        const betweenLimitedTeachers = availableLimitedTeachers.filter(t => !!t.workingHours.min && !!t.workingHours.max && (t.workingHours.min < t.workingHours.max) && (t.workingHours.min >= 0) && (t.workingHours.max >= lessonDuration));
        const maxLimitedTeachers = availableLimitedTeachers.filter(t => !t.workingHours.min && !!t.workingHours.max && (t.workingHours.max >= lessonDuration));
        const undeterminedLimitedTeachers = availableLimitedTeachers.filter(t => !t.workingHours.min && !t.workingHours.max);

        const preferredExactLimitedTeachers = exactLimitedTeachers.filter(t => t.preferedLevelNames.includes(level.name));
        const preferredMinLimitedTeachers = minLimitedTeachers.filter(t => t.preferedLevelNames.includes(level.name));
        const preferredBetweenLimitedTeachers = betweenLimitedTeachers.filter(t => t.preferedLevelNames.includes(level.name));
        const preferredMaxLimitedTeachers = maxLimitedTeachers.filter(t => t.preferedLevelNames.includes(level.name));
        const preferredUndeterminedLimitedTeachers = undeterminedLimitedTeachers.filter(t => t.preferedLevelNames.includes(level.name));

        const exactTeachers = availableTeachers.filter(t => !!t.workingHours.min && (t.workingHours.min === t.workingHours.max) && (t.workingHours.max >= lessonDuration));
        const minTeachers = availableTeachers.filter(t => !!t.workingHours.min && !t.workingHours.max && (t.workingHours.min >= 0));
        const betweenTeachers = availableTeachers.filter(t => !!t.workingHours.min && !!t.workingHours.max && (t.workingHours.min < t.workingHours.max) && (t.workingHours.min >= 0) && (t.workingHours.max >= lessonDuration));
        const maxTeachers = availableTeachers.filter(t => !t.workingHours.min && !!t.workingHours.max && (t.workingHours.max >= lessonDuration));
        const undeterminedTeachers = availableTeachers.filter(t => !t.workingHours.min && !t.workingHours.max);

        const preferredExactTeachers = exactTeachers.filter(t => t.preferedLevelNames.includes(level.name));
        const preferredMinTeachers = minTeachers.filter(t => t.preferedLevelNames.includes(level.name));
        const preferredBetweenTeachers = betweenTeachers.filter(t => t.preferedLevelNames.includes(level.name));
        const preferredMaxTeachers = maxTeachers.filter(t => t.preferedLevelNames.includes(level.name));
        const preferredUndeterminedTeachers = undeterminedTeachers.filter(t => t.preferedLevelNames.includes(level.name));

        let selectedTeacher;
        if (preferredExactLimitedTeachers.length > 0) {
          selectedTeacher = randomOrder(preferredExactLimitedTeachers)[0];
        } else if (preferredMinLimitedTeachers.length > 0) {
          selectedTeacher = randomOrder(preferredMinLimitedTeachers)[0];
        } else if (preferredBetweenLimitedTeachers.length > 0) {
          selectedTeacher = randomOrder(preferredBetweenLimitedTeachers)[0];
        } else if (preferredMaxLimitedTeachers.length > 0) {
          selectedTeacher = randomOrder(preferredMaxLimitedTeachers)[0];
        } else if (preferredUndeterminedLimitedTeachers.length > 0) {
          selectedTeacher = randomOrder(preferredUndeterminedLimitedTeachers)[0];
        } else if (exactLimitedTeachers.length > 0) {
          selectedTeacher = randomOrder(exactLimitedTeachers)[0];
        } else if (minLimitedTeachers.length > 0) {
          selectedTeacher = randomOrder(minLimitedTeachers)[0];
        } else if (betweenLimitedTeachers.length > 0) {
          selectedTeacher = randomOrder(betweenLimitedTeachers)[0];
        } else if (maxLimitedTeachers.length > 0) {
          selectedTeacher = randomOrder(maxLimitedTeachers)[0];
        } else if (undeterminedLimitedTeachers.length > 0) {
          selectedTeacher = randomOrder(undeterminedLimitedTeachers)[0];
        } else if (availableLimitedTeachers.length > 0) {
          selectedTeacher = randomOrder(availableLimitedTeachers)[0];
        } else if (preferredExactTeachers.length > 0) {
          selectedTeacher = randomOrder(preferredExactTeachers)[0];
        } else if (preferredMinTeachers.length > 0) {
          selectedTeacher = randomOrder(preferredMinTeachers)[0];
        } else if (preferredBetweenTeachers.length > 0) {
          selectedTeacher = randomOrder(preferredBetweenTeachers)[0];
        } else if (preferredMaxTeachers.length > 0) {
          selectedTeacher = randomOrder(preferredMaxTeachers)[0];
        } else if (preferredUndeterminedTeachers.length > 0) {
          selectedTeacher = randomOrder(preferredUndeterminedTeachers)[0];
        } else if (exactTeachers.length > 0) {
          selectedTeacher = randomOrder(exactTeachers)[0];
        } else if (minTeachers.length > 0) {
          selectedTeacher = randomOrder(minTeachers)[0];
        } else if (betweenTeachers.length > 0) {
          selectedTeacher = randomOrder(betweenTeachers)[0];
        } else if (maxTeachers.length > 0) {
          selectedTeacher = randomOrder(maxTeachers)[0];
        } else if (undeterminedTeachers.length > 0) {
          selectedTeacher = randomOrder(undeterminedTeachers)[0];
        } else if (availableTeachers.length > 0) {
          selectedTeacher = randomOrder(availableTeachers)[0];
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

function randomOrder(list) {
  return list.sort(() => Math.random() - 0.5);
}
