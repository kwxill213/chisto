// app/account/support/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/app/(admin)/components/DataTable';

interface Ticket {
  id: number;
  subject: string;
  status: { name: string };
  createdAt: string;
  updatedAt: string;
  messages: { id: number; isRead: boolean }[];
}

export default function UserSupportPage() {
  const { isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated]);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/support/tickets');
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'subject',
      header: 'Тема',
      cell: ({ row }) => (
        <Link href={`/profile/support/${row.original.id}`} className="font-medium text-blue-600 hover:underline">
          {row.getValue('subject')}
        </Link>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => {
        const status = row.original.status.name;
        const variant = status === 'open' ? 'destructive' 
          : status === 'in_progress' ? 'secondary' 
          : 'default';
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Создан',
      cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleString(),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Обновлен',
      cell: ({ row }) => new Date(row.getValue('updatedAt')).toLocaleString(),
    },
    {
      accessorKey: 'messages',
      header: 'Ответы',
      cell: ({ row }) => {
        const unread = row.original.messages.filter(m => !m.isRead).length;
        return unread > 0 ? (
          <Badge variant="secondary">{unread} новых</Badge>
        ) : null;
      },
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Необходима авторизация</h1>
        <p>Пожалуйста, войдите в систему для просмотра ваших обращений</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мои обращения в поддержку</h1>
        <Button asChild>
          <Link href="/contacts">Создать новое обращение</Link>
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={tickets}
      />
    </div>
  );
}