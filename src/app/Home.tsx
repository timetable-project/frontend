import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header'; // Путь к вашему компоненту Header
import React from 'react';

export function Home() {
  const [_isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // eslint-disable-line
  const [_role, setRole] = useState<string | null>(null); // eslint-disable-line
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
