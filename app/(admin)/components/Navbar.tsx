// components/admin/Navbar.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AdminNavbar() {
  const { name, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Админ-панель</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
}