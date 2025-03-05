'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';

export function LoggedHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/');
    toast.success('Выход выполнен!');
  };

  return (
    <header className="w-full flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
      <div className="text-xl font-bold text-blue-600">Timetable</div>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
      >
        Выйти
      </button>

    </header>
  );
}
