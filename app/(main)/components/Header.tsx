// components/Header.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NotificationCenter } from './notifications/NotificationCenter';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, name, avatar, roleId, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.refresh();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Чисто и точка
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Услуги
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              О нас
            </Link>
            <Link href="/contacts" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Контакты
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
            <div className="relative flex items-center gap-2">
              <NotificationCenter />
              <button
                className="flex items-center focus:outline-none"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <Avatar className="w-10 h-10 border border-gray-200">
                  {avatar ? (
                    <AvatarImage src={avatar} alt={name || 'Профиль'} />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {name ? name.charAt(0).toUpperCase() : 'П'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>
              </div>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium">{name || 'Пользователь'}</p>
                    <p className="text-sm text-gray-500">
                      {roleId === 2 ? 'Сотрудник' : roleId === 3 ? 'Администратор' : 'Клиент'}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Профиль
                  </Link>
                  {roleId === 2 && (
                    <Link
                      href="/employee"
                      className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Панель сотрудника
                    </Link>
                  )}
                  {roleId === 3 && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Админ панель
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 transition-colors"
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex space-x-3">
              <Button asChild variant="outline">
                <Link href="/login">
                  Вход
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">
                  Регистрация
                </Link>
              </Button>
            </div>
          )}

          <button 
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/services" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Услуги
            </Link>
            <Link 
              href="/about" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              О нас
            </Link>
            <Link 
              href="/contacts" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Контакты
            </Link>
            
            {!isAuthenticated && (
              <div className="pt-4 space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Вход
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    Регистрация
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}