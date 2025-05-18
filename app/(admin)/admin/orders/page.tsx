'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../../components/DataTable';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import type { CellContext } from '@tanstack/react-table';

type AdminOrder = {
  id: number;
  user: string;
  status: string;
  totalPrice: number;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(setOrders);
  }, []);
  const handleDelete = async (id: number) => {
    if (!confirm('Удалить заказ?')) return;
    await fetch('/api/admin/orders', { method: 'DELETE', body: JSON.stringify({ id }) });
    setOrders(orders => orders.filter(o => o.id !== id));
  };
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (cell: CellContext<AdminOrder, unknown>) => cell.getValue() as number,
    },
    {
      accessorKey: 'user',
      header: 'Клиент',
      cell: (cell: CellContext<AdminOrder, unknown>) => cell.getValue() as string,
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: (cell: CellContext<AdminOrder, unknown>) => cell.getValue() as string,
    },
    {
      accessorKey: 'totalPrice',
      header: 'Сумма',
      cell: (cell: CellContext<AdminOrder, unknown>) => (cell.getValue() as number) + ' ₽',
    },
    {
      accessorKey: 'createdAt',
      header: 'Создан',
      cell: (cell: CellContext<AdminOrder, unknown>) =>
        new Date(cell.getValue() as string).toLocaleDateString('ru-RU'),
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }: CellContext<AdminOrder, unknown>) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/admin/orders/edit/${row.original.id}`}><Pencil className="w-4 h-4" /></Link>
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Заказы</h1>

      </div>
      <div className="bg-white rounded-lg border">
        <DataTable
          columns={columns}
          data={orders}
          filterKey="user"
          filterPlaceholder="Фильтр по клиенту..."
        />
      </div>
    </div>
  );
}