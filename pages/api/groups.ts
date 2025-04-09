// pages/api/groups.ts

import { getGroups, setGroups } from "@/shared";
import { NextApiRequest, NextApiResponse } from "next";

// Пример начальных данных

let nextId = 3;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let groups = getGroups();
  if (req.method === "GET") {
    return res.status(200).json(groups);
  }

  if (req.method === "POST") {
    const { name, subjects } = req.body;
    if (typeof name !== "string" || !Array.isArray(subjects)) {
      return res.status(400).json({ message: "Неверный формат данных" });
    }

    const newGroup = {
      id: nextId++,
      name,
      subjects,
    };
    groups.push(newGroup);
    setGroups(groups);
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
    setGroups(groups);
    return res.status(200).json({ message: "Группа удалена" });
  }

  res.status(405).json({ message: "Метод не поддерживается" });
}
