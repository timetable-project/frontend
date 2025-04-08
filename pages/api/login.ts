import type { NextApiRequest, NextApiResponse } from "next";
import { users } from "./register";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не поддерживается" });
  }

  const { nickname, password } = req.body;

  // Проверка существования пользователя в мапе
  const user = users.get(nickname);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Неверный ник или пароль" });
  }

  // Возвращаем успешный ответ
  return res.status(200).json({
    message: "Успешный вход",
    token: `fake-jwt-token-${user.role}`, // Генерация токена в зависимости от роли
    role: user.role, // Роль пользователя
  });
}
