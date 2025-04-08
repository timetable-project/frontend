// pages/api/groups.ts

import { NextApiRequest, NextApiResponse } from "next";

type GroupSubject = {
  subjectId: number;
  lessons: number;
};

type Group = {
  id: number;
  name: string;
  subjects: GroupSubject[];
};

// Пример начальных данных
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
    subjects: [
      { subjectId: 3, lessons: 4 },
    ],
  },
];

let nextId = 3;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(groups);
  }

  if (req.method === "POST") {
    const { name, subjects } = req.body;
    if (typeof name !== "string" || !Array.isArray(subjects)) {
      return res.status(400).json({ message: "Неверный формат данных" });
    }

    const newGroup: Group = {
      id: nextId++,
      name,
      subjects,
    };
    groups.push(newGroup);
    return res.status(200).json(newGroup);
  }

  if (req.method === "PUT") {
    const { id, name, subjects } = req.body;
    const groupIndex = groups.findIndex((g) => g.id === id);
    if (groupIndex === -1) {
      return res.status(404).json({ message: "Группа не найдена" });
    }
    groups[groupIndex] = { id, name, subjects };
    return res.status(200).json({ message: "Группа обновлена" });
  }

  if (req.method === "DELETE") {
    const id = parseInt(req.query.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Некорректный ID" });
    }
    groups = groups.filter((g) => g.id !== id);
    return res.status(200).json({ message: "Группа удалена" });
  }

  res.status(405).json({ message: "Метод не поддерживается" });
}
