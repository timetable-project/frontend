/* eslint-disable */
import { getClasses, getGroups, getSubjects, getTeachers } from "@/shared";

function isConflict(
  schedule: any[],
  day: string,
  timeslot: string,
  teacher: string,
  classroom: string,
) {
  return schedule.some(
    (entry) =>
      entry.day === day &&
      entry.timeslot === timeslot &&
      (entry.teacher === teacher || entry.classroom === classroom),
  );
}

export function generateSchedule() {
  const groups = getGroups();
  const subjects = getSubjects();
  const teachers = getTeachers();
  const classes = getClasses();

  const days = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  const timeslots = [
    "Урок 1",
    "Урок 2",
    "Урок 3",
    "Урок 4",
    "Урок 5",
    "Урок 6",
  ];
  const schedule: any[] = [];
  let lessonId = 1;

  for (const group of groups) {
    for (const { subjectId, lessons } of group.subjects) {
      const subjectName = subjects.find((s) => s.id === subjectId)?.name;
      const teacher = teachers.find((t) => t.subjects.includes(subjectId));

      let placedLessons = 0;

      for (const day of days) {
        for (const timeslot of timeslots) {
          if (placedLessons >= lessons) break;

          const classroom = classes.find(
            (c) =>
              !schedule.some(
                (entry) =>
                  entry.day === day &&
                  entry.timeslot === timeslot &&
                  entry.classroom === c.name,
              ),
          );

          if (
            teacher &&
            !isConflict(
              schedule,
              day,
              timeslot,
              teacher.name,
              classroom?.name || "",
            )
          ) {
            schedule.push({
              id: lessonId++,
              group: group.name,
              subject: subjectName,
              teacher: teacher.name,
              classroom: classroom?.name || "Нет кабинета",
              day,
              timeslot,
            });
            placedLessons++;
          }
        }
      }
    }
  }

  return schedule;
}
