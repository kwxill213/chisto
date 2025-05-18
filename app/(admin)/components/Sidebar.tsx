// components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Home,
  Ticket
} from 'lucide-react';

const navItems = [
  {
    href: '/admin',
    icon: LayoutDashboard,
    label: 'Дашборд',
  },
  {
    href: '/admin/users',
    icon: Users,
    label: 'Пользователи',
  },
  {
    href: '/admin/orders',
    icon: ClipboardList,
    label: 'Заказы',
  },
  {
    href: '/admin/services',
    icon: FileText,
    label: 'Услуги',
  },
  {
    href: '/admin/support/tickets',
    icon: Ticket,
    label: 'Тикеты',
  },
  {
    href: '/',
    icon: Home,
    label: 'На сайт',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}