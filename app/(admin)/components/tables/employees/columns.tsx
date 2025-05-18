import { Employee } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Employee, any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Имя' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Телефон' },
  { accessorKey: 'role', header: 'Роль' },
  {
    accessorKey: 'createdAt',
    header: 'Создан',
    cell: info =>
      info.getValue()
        ? new Date(info.getValue() as string).toLocaleDateString('ru-RU')
        : '-',
  },
];