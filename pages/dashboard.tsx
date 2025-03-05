import { LoggedHeader } from '@/app/LoggedHeader';
import { useRouter } from 'next/navigation';

import '@/app/globals.css';

export default function Dashboard() {
  const router = useRouter();

  const handleScheduleClick = () => {
    router.push('/schedule'); // Перейти на страницу расписания (при необходимости)
  };

  const handleAdminPanelClick = () => {
    router.push('/admin'); // Перейти в админскую панель (если админ)
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LoggedHeader />
      
      <div className="flex gap-4 p-4">
        <button
          onClick={handleScheduleClick}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Просмотр расписания
        </button>
        <button
          onClick={handleAdminPanelClick}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Админ панель
        </button>
      </div>

    </div>
  );
}
