import { NextApiRequest, NextApiResponse } from "next";

// Пример начальных данных
let teachers = [
  { id: 1, name: "Иванов Иван Иванович", subjects: [1, 2] },
  { id: 2, name: "Петрова Анна Сергеевна", subjects: [5, 9] },
  { id: 3, name: "Сидоров Алексей Николаевич", subjects: [3, 4] },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(teachers);
  }

  if (req.method === "POST") {
    const { name, subjects } = req.body;

    if (!name || !Array.isArray(subjects)) {
      return res.status(400).json({ message: "Неверный формат данных" });
    }

    const newTeacher = {
      id: Date.now(),
      name,
      subjects,
    };

    teachers.push(newTeacher);
    return res.status(201).json(newTeacher);
  }

  if (req.method === "PUT") {
    const { id, name, subjects } = req.body;

    if (typeof id !== "number" || !name || !Array.isArray(subjects)) {
      return res.status(400).json({ message: "Неверный формат данных" });
    }

    const index = teachers.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Учитель не найден" });
    }

    teachers[index] = { id, name, subjects };
    return res.status(200).json({ message: "Учитель обновлён" });
  }

  if (req.method === "DELETE") {
    const id = parseInt(req.query.id as string);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Неверный ID" });
    }

    teachers = teachers.filter((t) => t.id !== id);
    return res.status(200).json({ message: "Учитель удалён" });
  }

  return res.status(405).json({ message: "Метод не поддерживается" });
}
