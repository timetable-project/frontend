import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Header } from './Header'; // Путь к вашему компоненту Header

export function Home() {
  const [_isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [_role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    }
  }, []);

  const handleLogin = (role: string, token: string) => {
    setIsAuthenticated(true);
    setRole(role);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    router.push('/dashboard'); // Переход на страницу панели
    toast.success('Вы успешно авторизованы!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header handleLogin={handleLogin} />

      <main className="flex flex-1 flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold">Добро пожаловать в Timetable!</h1>
        <p className="text-gray-600 mt-2">
          Ваш удобный инструмент для управления расписанием.
        </p>
      </main>
    </div>
  );
}
