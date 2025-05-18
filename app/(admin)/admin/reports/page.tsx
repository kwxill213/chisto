'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../../components/DataTable';
import Link from 'next/link';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/admin/reports')
      .then(res => res.json())
      .then(setReports);
  }, []);
  const handleDelete = async (id: number) => {
    if (!confirm('Удалить отчёт?')) return;
    await fetch('/api/admin/reports', { method: 'DELETE', body: JSON.stringify({ id }) });
    setReports(reports => reports.filter(r => r.id !== id));
  };
  const columns = [
    { accessorKey: 'id', header: 'ID', cell: (info: any) => info.getValue() },
    { accessorKey: 'title', header: 'Название', cell: (info: any) => info.getValue() },
    { accessorKey: 'createdAt', header: 'Создан', cell: (info: any) => new Date(info.getValue()).toLocaleDateString('ru-RU') },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/admin/reports/edit/${row.original.id}`}><Pencil className="w-4 h-4" /></Link>
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
        <h1 className="text-2xl font-bold">Отчёты</h1>
        <Button asChild>
          <Link href="/admin/reports/new"><Plus className="h-4 w-4 mr-2" />Добавить отчёт</Link>
        </Button>
      </div>
      <div className="bg-white rounded-lg border">
        <DataTable
          columns={columns}
          data={reports}
          filterKey="title"
          filterPlaceholder="Фильтр по названию отчёта..."
        />
      </div>
    </div>
  );
}