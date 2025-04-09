import { getSubjects, setSubjects } from "@/shared";
import { NextApiRequest, NextApiResponse } from "next";

// Пример данных, которые имитируют БД

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let subjects = getSubjects();
  if (req.method === "GET") {
    return res.status(200).json(subjects);
  }

  if (req.method === "POST") {
    const { subjects: updatedSubjects } = req.body;
    subjects = updatedSubjects;
    setSubjects(subjects);
    return res.status(200).json({ message: "Предметы сохранены" });
  }

  res.status(405).json({ message: "Метод не поддерживается" });
}
