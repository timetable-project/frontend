// lib/sharedState.ts

/* eslint-disable */

type GroupSubject = {
  subjectId: number;
  lessons: number;
};

type Group = {
  id: number;
  name: string;
  subjects: GroupSubject[];
};

let schedule: any[] = [];
let groups: Group[] = [
  {
    id: 1,
    name: "10А",
    subjects: [
      { subjectId: 1, lessons: 3 },
      { subjectId: 2, lessons: 2 },
    ],
  },
  {
    id: 2,
    name: "10Б",
    subjects: [{ subjectId: 3, lessons: 4 }],
  },
];
let subjects = [
  { id: 1, name: "Математика" },
  { id: 2, name: "Физика" },
  { id: 3, name: "Химия" },
  { id: 4, name: "Биология" },
  { id: 5, name: "Литература" },
  { id: 6, name: "История" },
  { id: 7, name: "География" },
  { id: 8, name: "Английский язык" },
  { id: 9, name: "Русский язык" },
  { id: 10, name: "Обществознание" },
];
let teachers = [
  { id: 1, name: "Иванов Иван Иванович", subjects: [1, 2] },
  { id: 2, name: "Петрова Анна Сергеевна", subjects: [5, 9] },
  { id: 3, name: "Сидоров Алексей Николаевич", subjects: [3, 4] },
];
let classes = [
  { id: 1, name: "Кабинет 101" },
  { id: 2, name: "Кабинет 202" },
  { id: 3, name: "Кабинет 303" },
  { id: 4, name: "Кабинет 304" },
  { id: 5, name: "Кабинет 304" },
  { id: 6, name: "Кабинет 306" },
  { id: 7, name: "Кабинет 307" },
  { id: 8, name: "Кабинет 308" },
  { id: 9, name: "Кабинет 309" },
  { id: 10, name: "Кабинет 310" },
];
let users = new Map<
  string,
  { password: string; email: string; role: string }
>();

users.set("admin", {
  password: "admin",
  email: "admin@example.com",
  role: "admin",
});
users.set("user", {
  password: "user",
  email: "user@example.com",
  role: "user",
});

export function getSchedule() {
  return schedule;
}

export function setSchedule(newSchedule: any[]) {
  schedule = newSchedule;
}

export function getGroups() {
  return groups;
}

export function setGroups(newGroups: any[]) {
  groups = newGroups;
}

export function getSubjects() {
  return subjects;
}

export function setSubjects(newSubjects: any[]) {
  subjects = newSubjects;
}

export function getTeachers() {
  return teachers;
}

export function setTeachers(newTeachers: any[]) {
  teachers = newTeachers;
}

export function getClasses() {
  return classes;
}

export function setClasses(newClasses: any[]) {
  classes = newClasses;
}

export function getUsers() {
  return users;
}

export function setUsers(newUsers: any) {
  users = newUsers;
}
