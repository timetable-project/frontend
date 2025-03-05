import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не поддерживается" });
  }

  const { nickname, email, password } = req.body;

  if (!nickname || !email || !password) {
    return res.status(400).json({ message: "Заполните все поля" });
  }

  return res
    .status(201)
    .json({ message: "Регистрация успешна", userId: Date.now() });
}
