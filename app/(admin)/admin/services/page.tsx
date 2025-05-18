'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { DataTable } from '../../components/DataTable';

export type Service = {
  id: number;
  name: string;
  description: string;
  basePrice: number | null;
  pricePerSquare: number | null;
  categoryId: number | null;
  duration: number | null;
  image_url: string | null;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить услугу?')) return;
    const res = await fetch('/api/admin/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setServices(services => services.filter(s => s.id !== id));
    }
  };
 
  const columns = [
    { accessorKey: 'id', header: 'ID', cell: (info: any) => info.getValue() },
    { accessorKey: 'name', header: 'Название', cell: (info: any) => info.getValue() },
    { accessorKey: 'description', header: 'Описание', cell: (info: any) => info.getValue() },
    { accessorKey: 'basePrice', header: 'Базовая цена', cell: (info: any) => info.getValue() ? info.getValue() + ' ₽' : '-' },
    { accessorKey: 'pricePerSquare', header: 'Цена за м²', cell: (info: any) => info.getValue() ? info.getValue() + ' ₽' : '-' },
    { accessorKey: 'duration', header: 'Длительность (мин)', cell: (info: any) => info.getValue() || '-' },
    {
      accessorKey: 'image_url',
      header: 'Изображение',
      cell: (info: any) =>
        info.getValue() ? (
          <img src={info.getValue()} alt="service" className="w-12 h-12 object-cover rounded" />
        ) : (
          <span className="text-gray-400">Нет</span>
        ),
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/admin/services/edit/${row.original.id}`}>
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
        <h1 className="text-2xl font-bold">Услуги</h1>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="h-4 w-4 mr-2" />
            Добавить услугу
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-lg border">
        <DataTable
          columns={columns}
          data={services}
          filterKey="name"
          filterPlaceholder="Фильтр по названию..."
        />
      </div>
    </div>
  );
}