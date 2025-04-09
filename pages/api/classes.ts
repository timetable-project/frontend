import { getClasses, setClasses } from "@/shared";
import { NextApiRequest, NextApiResponse } from "next";

// Пример данных, которые имитируют БД

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let classes = getClasses();
  if (req.method === "GET") {
    return res.status(200).json(classes);
  }

  if (req.method === "POST") {
    const { classes: updatedClasses } = req.body;
    classes = updatedClasses;
    setClasses(classes);
    return res.status(200).json({ message: "Кабинеты сохранены" });
  }

  res.status(405).json({ message: "Метод не поддерживается" });
}
