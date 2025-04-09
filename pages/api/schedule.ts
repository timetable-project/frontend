import { generateSchedule } from "@/algo";
import { getSchedule, setSchedule } from "@/shared";
import type { NextApiRequest, NextApiResponse } from "next";

setSchedule(generateSchedule());

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let schedule = getSchedule();
  if (req.method === "GET") {
    return res.status(200).json({ schedule });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не поддерживается" });
  }

  try {
    schedule = generateSchedule();
    setSchedule(schedule);

    return res.status(200).json({
      message: "Расписание успешно сгенерировано",
      schedule,
    });
  } catch (error) {
    console.error("Ошибка при генерации расписания:", error);
    return res.status(500).json({ message: "Ошибка при генерации расписания" });
  }
}
