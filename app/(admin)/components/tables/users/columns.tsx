import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/lib/types';


export const columns: ColumnDef<User, any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Имя' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Роль' },
  { accessorKey: 'phone', header: 'Телефон' },
  {
    accessorKey: 'createdAt',
    header: 'Создан',
    cell: (info) =>
      info.getValue()
        ? new Date(info.getValue() as string).toLocaleDateString('ru-RU')
        : '-',
  },
];