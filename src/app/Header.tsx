'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';
import { LoginModal } from './LoginModal';

type HandleLoginProps = {
  handleLogin: (role: string, token: string) => void;
};

export function Header({ handleLogin }: HandleLoginProps) {
  const [isLoginOpen, setLoginOpen] = useState(false);

  return (
    <header className="w-full flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
      <div className="text-xl font-bold text-blue-600">Timetable</div>

      <button
        onClick={() => setLoginOpen(true)}
        className="text-gray-600 hover:text-blue-600 transition"
      >
        <User size={28} />
      </button>

      {isLoginOpen && <LoginModal onClose={() => setLoginOpen(false)} handleLogin={handleLogin} />}
    </header>
  );
}
