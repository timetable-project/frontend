'use client';

import '@/app/globals.css';
import Panel from '@/app/Panel';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Teacher {
  id: number;
  name: string;
}

interface ScheduleEntry {
  id: number;
  day: string;
  timeslot: string;
  subject: string;
  group: string;
  teacher: string;
  classroom: string;
}

export default function TeachersSchedule() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherName, setSelectedTeacherName] = useState<string | null>(null);
  const [allSchedule, setAllSchedule] = useState<ScheduleEntry[]>([]);
  const [filteredSchedule, setFilteredSchedule] = useState<ScheduleEntry[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [teachersRes, scheduleRes] = await Promise.all([
          axios.get('/api/teachers'),
          axios.get('/api/schedule'),
        ]);
        setTeachers(teachersRes.data);
        setAllSchedule(scheduleRes.data.schedule); // предположим, что API возвращает объект { schedule: [...] }
      } catch (error) {
        toast.error('Ошибка при загрузке данных');
        console.error(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
  if (!selectedTeacherName) {
    setFilteredSchedule([]);
    return;
  }

  // Фильтруем расписание по выбранной группе
    const filtered = allSchedule.filter((entry) => entry.teacher === selectedTeacherName);

  // Индексы для дней недели
  const daysOfWeek = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];

  // Сортируем расписание сначала по дню недели, затем по времени
  const sorted = filtered.sort((a, b) => {
    // Сортировка по дню недели
    const dayAIndex = daysOfWeek.indexOf(a.day);
    const dayBIndex = daysOfWeek.indexOf(b.day);

    // Если дни разные, сортируем по индексу дня
    if (dayAIndex !== dayBIndex) {
      return dayAIndex - dayBIndex;
    }

    // Если дни одинаковые, сортируем по номеру урока
    const timeslotA = parseInt(a.timeslot.replace('Урок ', ''));
    const timeslotB = parseInt(b.timeslot.replace('Урок ', ''));

    return timeslotA - timeslotB;
  });

  setFilteredSchedule(sorted);
}, [selectedTeacherName, allSchedule]);

  return (
    <Panel>
      <main className="p-4 space-y-6">
        {/* Выпадающий список учителей */}
        <div>
          <label htmlFor="teacher-select" className="block mb-2 font-medium">Выберите преподавателя:</label>
          <select
            id="teacher-select"
            value={selectedTeacherName ?? ''}
            onChange={(e) => setSelectedTeacherName(e.target.value)}
            className="p-2 rounded border border-gray-300 w-full max-w-md"
          >
            <option value="" disabled>-- Выберите --</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.name}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        {/* Расписание */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Расписание:</h2>
          {filteredSchedule.length === 0 ? (
            <p className="text-gray-500">Нет доступного расписания.</p>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">День</th>
                  <th className="border border-gray-300 px-4 py-2">Время</th>
                  <th className="border border-gray-300 px-4 py-2">Предмет</th>
                  <th className="border border-gray-300 px-4 py-2">Группа</th>
                  <th className="border border-gray-300 px-4 py-2">Кабинет</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.map((entry) => (
                  <tr key={entry.id}>
                    <td className="border border-gray-300 px-4 py-2">{entry.day}</td>
                    <td className="border border-gray-300 px-4 py-2">{entry.timeslot}</td>
                    <td className="border border-gray-300 px-4 py-2">{entry.subject}</td>
                    <td className="border border-gray-300 px-4 py-2">{entry.group}</td>
                    <td className="border border-gray-300 px-4 py-2">{entry.classroom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </Panel>
  );
}
