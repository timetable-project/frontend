/* eslint-disable */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoggedHeader } from '@/app/LoggedHeader';

export default function Panel({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Получаем роль из localStorage
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

   const handleGenerateSchedule = async () => {
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Ошибка при генерации расписания');
      }

      toast.success('Расписание успешно сгенерировано');
    } catch (error) {
      toast.error('Ошибка при генерации расписания');
    }
  };

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  // Все возможные пункты меню
  const allItems = [
    ["Расписание групп", "groups-schedule", "user", "admin"],
    ["Расписание учителей", "teachers-schedule", "user", "admin"],
    ["Группы", "groups", "admin"],
    ["Учителя", "teachers", "admin"],
    ["Кабинеты", "classes", "admin"],
    ["Предметы", "subjects", "admin"],
  ];

  // Фильтруем пункты в зависимости от роли
  const filteredItems = allItems.filter(([label, path, ...roles]) => {
    // Показываем пункт, если роль пользователя совпадает с одной из разрешенных ролей для этого пункта
    return roles.includes(role || '');
  });

  return (
    <div className="min-h-screen flex">
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      {/* Боковая панель */}
      <aside className="bg-blue-600 text-white p-6 flex flex-col gap-6 transition-all duration-300 shadow-lg w-64">
        {filteredItems.map(([label, path]) => (
          <button
            key={path}
            onClick={() => handleNavigation('/' + path)}
            className="bg-blue-800 py-3 px-5 rounded-lg border-2 border-transparent hover:border-blue-500 hover:bg-blue-900 transition transform hover:scale-105 mt-4 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          >
            {label}
          </button>
        ))}

        {/* Кнопка для админа */}
        {role === "admin" && (
          <button
            onClick={handleGenerateSchedule}
            className="bg-green-600 py-3 px-5 rounded-lg border-2 border-transparent hover:border-green-500 hover:bg-green-700 transition transform hover:scale-105 mt-4 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          >
            Сгенерировать расписание
          </button>
        )}
      </aside>

      {/* Основной контент (растянутый на всю высоту) */}
      <div className="flex-1 flex flex-col">
        <LoggedHeader />

        {/* Контейнер для контента: занимает всю оставшуюся высоту */}
        <main className="flex-1 overflow-hidden">
          {/* Дочерний контент внутри прокручивается отдельно */}
          <div className="h-full overflow-y-auto p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
