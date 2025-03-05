import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не поддерживается" });
  }

  const { nickname, password } = req.body;

  // Моки для проверки логина по нику
  if (nickname === "admin" && password === "admin") {
    // Успешный логин для админа
    return res.status(200).json({
      message: "Успешный вход",
      token: "fake-jwt-token-admin", // Токен для админа
      role: "admin", // Роль админа
    });
  } else if (nickname === "user" && password === "user") {
    // Успешный логин для обычного пользователя
    return res.status(200).json({
      message: "Успешный вход",
      token: "fake-jwt-token-user", // Токен для пользователя
      role: "user", // Роль пользователя
    });
  } else {
    // Ошибка авторизации
    return res.status(401).json({ message: "Неверный ник или пароль" });
  }
}
