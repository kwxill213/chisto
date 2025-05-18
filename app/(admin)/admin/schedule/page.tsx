'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../../components/DataTable';
import Link from 'next/link';
import { Pencil, Trash2, Plus } from 'lucide-react';

// Define a type for schedule events
type ScheduleEvent = {
  id: number;
  title: string;
  date: string;
  // ...add other fields if needed
};

export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  useEffect(() => {
    fetch('/api/admin/schedule')
      .then(res => res.json())
      .then(setEvents);
  }, []);
  const handleDelete = async (id: number) => {
    if (!confirm('Удалить событие?')) return;
    await fetch('/api/admin/schedule', { method: 'DELETE', body: JSON.stringify({ id }) });
    setEvents(events => events.filter(e => e.id !== id));
  };
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (info: import('@tanstack/react-table').CellContext<ScheduleEvent, unknown>) => info.getValue(),
    },
    {
      accessorKey: 'title',
      header: 'Заголовок',
      cell: (info: import('@tanstack/react-table').CellContext<ScheduleEvent, unknown>) => info.getValue(),
    },
    {
      accessorKey: 'date',
      header: 'Дата',
      cell: (info: import('@tanstack/react-table').CellContext<ScheduleEvent, unknown>) =>
        new Date(info.getValue() as string).toLocaleString('ru-RU'),
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }: import('@tanstack/react-table').CellContext<ScheduleEvent, unknown>) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/admin/schedule/edit/${row.original.id}`}><Pencil className="w-4 h-4" /></Link>
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
        <h1 className="text-2xl font-bold">Расписание</h1>
        <Button asChild>
          <Link href="/admin/schedule/new"><Plus className="h-4 w-4 mr-2" />Добавить событие</Link>
        </Button>
      </div>
      <div className="bg-white rounded-lg border">
        <DataTable
          columns={columns}
          data={events}
          filterKey="title"
          filterPlaceholder="Фильтр по заголовку..."
        />
      </div>
    </div>
  );
}