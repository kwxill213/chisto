// components/admin/users/DataTable.tsx
'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { DataTablePagination } from './Pagination';
import { DataTableViewOptions } from './ViewOptions';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey?: keyof TData;
  filterPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  filterPlaceholder = 'Поиск...',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterValue, setFilterValue] = useState('');

  const filteredData = useMemo(() => {
    if (!filterKey || !filterValue) return data;
    return data.filter((item) => {
      const value = item[filterKey];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(filterValue.toLowerCase());
      }
      if (typeof value === 'number') {
        return value.toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      return false;
    });
  }, [data, filterKey, filterValue]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4">
        {filterKey && (
          <Input
            placeholder={filterPlaceholder}
            value={filterValue}
            onChange={e => setFilterValue(e.target.value)}
            className="max-w-sm"
          />
        )}
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Нет данных
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}