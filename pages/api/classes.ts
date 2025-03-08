import { NextApiRequest, NextApiResponse } from "next";

// Пример данных, которые имитируют БД
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(classes);
  }

  if (req.method === "POST") {
    const { classes: updatedClasses } = req.body;
    classes = updatedClasses;
    return res.status(200).json({ message: "Кабинеты сохранены" });
  }

  res.status(405).json({ message: "Метод не поддерживается" });
}
