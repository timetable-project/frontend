import { NextApiRequest, NextApiResponse } from "next";

// Пример данных, которые имитируют БД
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(subjects);
  }

  if (req.method === "POST") {
    const { subjects: updatedSubjects } = req.body;
    subjects = updatedSubjects;
    return res.status(200).json({ message: "Предметы сохранены" });
  }

  res.status(405).json({ message: "Метод не поддерживается" });
}
