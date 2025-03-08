'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type LoginModalProps = {
  onClose: () => void;
  handleLogin: (role: string, token: string) => void;
};

export function LoginModal({ onClose, handleLogin }: LoginModalProps) {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const url = isRegistering ? '/api/register' : '/api/login';
    const payload = isRegistering
      ? { nickname, email, password } // Используем ник для регистрации
      : { nickname, password }; // Используем ник для логина

    try {
      const response = await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        const { token, role } = response.data;

        if (isRegistering) {
          toast.success('Регистрация прошла успешно!');
          onClose()
        } else {
          handleLogin(role, token);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isRegistering ? 'Регистрация' : 'Вход'}
        </h2>

        <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border border-gray-300 rounded"
              required
            />
          )}
          <input
            type="text"
            placeholder="Ник"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Загрузка...' : isRegistering ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

        <div className="mt-4 text-center text-sm">
          {isRegistering ? (
            <span>
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-blue-600 hover:underline"
              >
                Войти
              </button>
            </span>
          ) : (
            <span>
              Нет аккаунта?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="text-blue-600 hover:underline"
              >
                Зарегистрироваться
              </button>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-gray-500 hover:underline text-sm"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
