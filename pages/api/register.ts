import { getUsers, setUsers } from "@/shared";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не поддерживается" });
  }

  const { nickname, email, password } = req.body;

  if (!nickname || !email || !password) {
    return res.status(400).json({ message: "Заполните все поля" });
  }

  // Проверка на уникальность никнейма
  const users = getUsers();
  if (users.has(nickname)) {
    return res
      .status(400)
      .json({ message: "Пользователь с таким никнеймом уже существует" });
  }

  // Определяем роль пользователя, по умолчанию "user"
  const role = "user"; // В дальнейшем можно делать более сложную логику для ролей

  // Добавляем пользователя в мапу
  users.set(nickname, { password, email, role });
  setUsers(users);

  return res
    .status(201)
    .json({ message: "Регистрация успешна", userId: Date.now() });
}
