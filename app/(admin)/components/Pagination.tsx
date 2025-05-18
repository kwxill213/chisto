'use client';

import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-end gap-2 p-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Назад
      </Button>
      <span className="text-sm">
        Страница {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Вперёд
      </Button>
    </div>
  );
}