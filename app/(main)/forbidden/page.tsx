'use client';

import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center max-w-md">
        <svg
          className="w-20 h-20 text-red-500 mb-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M9 9l6 6m0-6l-6 6"
          />
        </svg>
        <h1 className="text-3xl font-bold text-red-600 mb-2">Доступ запрещён</h1>
        <p className="text-gray-600 mb-6 text-center">
          У вас нет прав для просмотра этой страницы.<br />
          Если вы считаете, что это ошибка, обратитесь к администратору.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}