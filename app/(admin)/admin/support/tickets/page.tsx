// app/admin/support/tickets/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/app/(admin)/components/DataTable';

interface Ticket {
  id: number;
  subject: string;
  status: { name: string };
  user: { name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
  messages: { id: number; isRead: boolean }[];
}

export default function AdminTicketsPage() {
  const { isAuthenticated, roleId } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && roleId === 3) { // 3 — id роли "admin"
      fetchTickets();
    }
  }, [isAuthenticated, roleId]);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/admin/support/tickets');
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: number, status: string) => {
    try {
      await fetch(`/api/admin/support/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: 'id',
      header: () => 'ID',
    },
    {
      accessorKey: 'subject',
      header: () => 'Тема',
      cell: ({ row }) => (
        <Link href={`/admin/support/tickets/${row.original.id}`} className="font-medium text-blue-600 hover:underline">
          {row.getValue('subject')}
        </Link>
      ),
    },
    {
      accessorKey: 'status',
      header: () => 'Статус',
      cell: ({ row }) => {
        const status = row.original.status.name;
        let variant: "default" | "destructive" | "secondary" | "outline" = "default";
        if (status === "open") variant = "destructive";
        else if (status === "in_progress") variant = "secondary";
        else if (status === "closed") variant = "default";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'user',
      header: () => 'Пользователь',
      cell: ({ row }) => row.original.user 
        ? `${row.original.user.name} (${row.original.user.email})` 
        : 'Гость',
    },
    {
      accessorKey: 'createdAt',
      header: () => 'Создан',
      cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleString(),
    },
    {
      accessorKey: 'updatedAt',
      header: () => 'Обновлен',
      cell: ({ row }) => new Date(row.getValue('updatedAt')).toLocaleString(),
    },
    {
      accessorKey: 'messages',
      header: () => 'Сообщения',
      cell: ({ row }) => {
        const unread = Array.isArray(row.original.messages)
          ? row.original.messages.filter(m => !m.isRead).length
          : 0;
        return unread > 0 ? (
          <Badge variant="secondary">{unread} непрочитано</Badge>
        ) : null;
      },
    },
    {
      id: 'actions',
      header: () => null,
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => updateTicketStatus(ticket.id, 'open')}
              >
                Открыть
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
              >
                В работе
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateTicketStatus(ticket.id, 'closed')}
              >
                Закрыть
              </DropdownMenuItem>
              <Link href={`/admin/support/tickets/${ticket.id}`} passHref>
                <DropdownMenuItem>Ответить</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (!isAuthenticated || roleId !== 3) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Доступ запрещен</h1>
        <p>У вас нет прав для просмотра этой страницы</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление тикетами поддержки</h1>
      </div>
      
      <DataTable
        columns={columns}
        data={tickets}
        // searchKey="subject"
      />
    </div>
  );
}