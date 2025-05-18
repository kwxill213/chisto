// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  try {
    const res = await api.post('/auth/login', { email, password });

    if (res.status === 200) {
      window.location.assign(callbackUrl);
    } else {
      const errorMessage = res.data?.message || 'Неверные учетные данные';
      setError(errorMessage);
    }
  } catch (err: any) {
    if (err.response) {
      const errorMessage = err.response.data?.message || 
                         err.response.data?.error || 
                         'Произошла ошибка при авторизации';
      setError(errorMessage);
    } else if (err.request) {
      setError('Ошибка соединения с сервером');
    } else {
      setError('Ошибка при отправке запроса');
    }
  }
};

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в аккаунт</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Войти
          </button>
        </form>
        <p className="mt-4 text-center">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}