import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Service } from '@/lib/types';

export const columns: ColumnDef<Service, any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Название' },
  { accessorKey: 'description', header: 'Описание' },
  { accessorKey: 'basePrice', header: 'Базовая цена', cell: info => info.getValue() ? info.getValue() + ' ₽' : '-' },
  { accessorKey: 'pricePerSquare', header: 'Цена за м²', cell: info => info.getValue() ? info.getValue() + ' ₽' : '-' },
  { accessorKey: 'duration', header: 'Длительность (мин)', cell: info => info.getValue() || '-' },
  {
    accessorKey: 'image_url',
    header: 'Изображение',
    cell: info =>
      info.getValue() ? (
        <img src={info.getValue() as string} alt="service" className="w-12 h-12 object-cover rounded" />
      ) : (
        <span className="text-gray-400">Нет</span>
      ),
  },
];