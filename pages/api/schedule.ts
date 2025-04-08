import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не поддерживается" });
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Заглушка для сгенерированного расписания
    const schedule = {
      message: "Расписание успешно сгенерировано",
      scheduleId: Date.now(), // уникальный ID для сгенерированного расписания
      subjects: ["Математика", "Физика", "Химия"], // Пример предметов
      groups: ["Группа 1", "Группа 2"], // Пример групп
    };

    // Отправляем успешный ответ
    return res.status(200).json(schedule);
  } catch (error) {
    console.error("Ошибка при генерации расписания:", error);
    return res.status(500).json({ message: "Ошибка при генерации расписания" });
  }
}
