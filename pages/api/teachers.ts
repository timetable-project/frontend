import { getTeachers, setTeachers } from "@/shared";
import { NextApiRequest, NextApiResponse } from "next";

// Пример начальных данных

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let teachers = getTeachers();
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
    setTeachers(teachers);
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
    setTeachers(teachers);
    return res.status(200).json({ message: "Учитель обновлён" });
  }

  if (req.method === "DELETE") {
    const id = parseInt(req.query.id as string);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Неверный ID" });
    }

    teachers = teachers.filter((t) => t.id !== id);
    setTeachers(teachers);
    return res.status(200).json({ message: "Учитель удалён" });
  }

  return res.status(405).json({ message: "Метод не поддерживается" });
}
