import { LoggedHeader } from '@/app/LoggedHeader';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import '@/app/globals.css';

export default function Panel({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const items = [
    ["Главная", "dashboard"],
    ["Расписание", "schedule"],
    ["Учителя", "teachers"],
    ["Классы", "classes"],
    ["Предметы", "subjects"],
  ];

  return (
    <div className="min-h-screen flex">
      {/* Боковая панель */}
      <aside className="bg-blue-600 text-white p-6 flex flex-col gap-6 transition-all duration-300 shadow-lg w-64">
        {items.map(([label, path]) => (
          <button
            key={path}
            onClick={() => handleNavigation('/' + path)}
            className="bg-blue-800 py-3 px-5 rounded-lg border-2 border-transparent hover:border-blue-500 hover:bg-blue-900 transition transform hover:scale-105 mt-4 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {label}
          </button>
        ))}
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
