'use client';

import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <div className="flex gap-2">
      {table.getAllLeafColumns().map((column) => (
        <Button
          key={column.id}
          variant={column.getIsVisible() ? 'default' : 'outline'}
          size="sm"
          onClick={() => column.toggleVisibility()}
        >
          {typeof column.columnDef.header === 'function' ? column.columnDef.header() : column.columnDef.header}
        </Button>
      ))}
    </div>
  );
}