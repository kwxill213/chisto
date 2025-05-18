import { Order } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Order, any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'user', header: 'Клиент' },
  { accessorKey: 'status', header: 'Статус' },
  { accessorKey: 'totalPrice', header: 'Сумма', cell: info => info.getValue() + ' ₽' },
  {
    accessorKey: 'createdAt',
    header: 'Создан',
    cell: info =>
      info.getValue()
        ? new Date(info.getValue() as string).toLocaleDateString('ru-RU')
        : '-',
  },
];