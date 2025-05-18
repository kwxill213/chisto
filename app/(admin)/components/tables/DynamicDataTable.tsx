'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Plus, Trash2, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

// Тип для одной строки таблицы
export type TableRow = {
  id?: number | string;
  [key: string]: any;
};

// Тип для одной колонки
export type TableColumn = {
  accessorKey: string;
  header: string;
  [key: string]: any;
};

interface DynamicDataTableProps {
  tableName: string;
  columns: TableColumn[];
  editable?: boolean;
}

export function DynamicDataTable({
  tableName,
  columns,
  editable = false,
}: DynamicDataTableProps) {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  // Состояние для редактируемой строки
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/data/${tableName}`);
      const result = await response.json();
      setData(result);
    } catch (error: any) {
      toast.error(`Ошибка загрузки данных: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Добавить новую строку
  const handleAdd = () => {
    const emptyRow: TableRow = {};
    columns.forEach((col: TableColumn) => {
      emptyRow[col.accessorKey] = '';
    });
    setData([...data, emptyRow]);
    setEditingRow(data.length); // сразу редактируем новую строку
  };

  // Удалить строку
  const handleDelete = async (rowIdx: number) => {
    const row = data[rowIdx];
    if (!row.id) {
      setData(data.filter((_, idx) => idx !== rowIdx));
      return;
    }
    try {
      await fetch(`/api/admin/data/${tableName}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row.id }),
      });
      toast.success('Удалено');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Сохранить изменения (PUT + POST)
  const handleSave = async () => {
    try {
      // Новые строки (без id) — POST, остальные — PUT
      const newRows = data.filter((row) => !row.id);
      const existingRows = data.filter((row) => row.id);

      if (existingRows.length) {
        await fetch(`/api/admin/data/${tableName}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(existingRows),
        });
      }
      for (const row of newRows) {
        await fetch(`/api/admin/data/${tableName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(row),
        });
      }
      toast.success('Изменения сохранены');
      fetchData();
      setEditingRow(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Обработчик изменения значения ячейки
  const handleCellChange = (rowIdx: number, accessorKey: string, value: string) => {
    setData(prev => {
      const newData = [...prev];
      newData[rowIdx] = { ...newData[rowIdx], [accessorKey]: value };
      return newData;
    });
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  return (
    <div className="space-y-4">
      {editable && (
        <div className="flex gap-2 mb-2">
          <Button onClick={handleAdd} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Добавить
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.accessorKey} className="border px-2 py-1">{col.header}</th>
              ))}
              {editable && <th className="border px-2 py-1">Действия</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={row.id ?? rowIdx}>
                {columns.map((col) => (
                  <td key={col.accessorKey} className="border px-2 py-1">
                    {editable && editingRow === rowIdx ? (
                      <input
                        className="border rounded px-1 py-0.5 w-full"
                        value={row[col.accessorKey] ?? ''}
                        onChange={e => handleCellChange(rowIdx, col.accessorKey, e.target.value)}
                      />
                    ) : (
                      row[col.accessorKey]
                    )}
                  </td>
                ))}
                {editable && (
                  <td className="border px-2 py-1 text-center flex gap-1 justify-center">
                    {editingRow === rowIdx ? (
                      <Button
                        variant="outline"
                        size="icon"
                        className="mr-1"
                        onClick={async () => {
                          setEditingRow(null);
                          // Сохраняем только одну строку
                          const row = { ...data[rowIdx] };
                          if (!row.id) delete row.id; // <-- Удаляем id, если он пустой

                          if (data[rowIdx].id) {
                            await fetch(`/api/admin/data/${tableName}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify([row]),
                            });
                          } else {
                            await fetch(`/api/admin/data/${tableName}`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(row),
                            });
                          }
                          toast.success('Строка сохранена');
                          fetchData();
                        }}
                        title="Закончить редактирование"
                      >
                        <Save className="h-4 w-4 text-green-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-1"
                        onClick={() => setEditingRow(rowIdx)}
                        title="Редактировать"
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rowIdx)}
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editable && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Сохранить изменения
          </Button>
        </div>
      )}
    </div>
  );
}