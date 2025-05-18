// app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { DataTable } from '../../components/DataTable';

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить пользователя?')) return;
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setUsers(users => users.filter(u => u.id !== id));
    }
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (info: any) => info.getValue(),
    },
    {
      accessorKey: 'name',
      header: 'Имя',
      cell: (info: any) => info.getValue(),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info: any) => info.getValue(),
    },
    {
      accessorKey: 'role',
      header: 'Роль',
      cell: (info: any) => info.getValue(),
    },
    {
      accessorKey: 'createdAt',
      header: 'Создан',
      cell: (info: any) =>
        new Date(info.getValue() as string).toLocaleDateString('ru-RU'),
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/admin/users/edit/${row.original.id}`}>
              <Pencil className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="h-4 w-4 mr-2" />
            Добавить пользователя
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-lg border">
        <DataTable
          columns={columns}
          data={users}
          filterKey="email"
          filterPlaceholder="Фильтр по email..."
        />
      </div>
    </div>
  );
}