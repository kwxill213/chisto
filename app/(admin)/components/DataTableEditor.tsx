// components/admin/DataTableEditor.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from './DataTable';
import { columns as userColumns } from './tables/users/columns';
import { columns as orderColumns } from './tables/orders/columns';
import { columns as serviceColumns } from './tables/services/columns';
import { columns as employeeColumns } from './tables/employees/columns';
import toast from 'react-hot-toast';

const tables = [
  { value: 'users', label: 'Пользователи', columns: userColumns },
  { value: 'orders', label: 'Заказы', columns: orderColumns },
  { value: 'services', label: 'Услуги', columns: serviceColumns },
  { value: 'employees', label: 'Работники', columns: employeeColumns },
];

export function DataTableEditor() {
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (tableName) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/${tableName}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(`Failed to fetch ${tableName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/${activeTab}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Ошибка сохранения');
      toast.success('Изменения сохранены');
      fetchData(activeTab);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {tables.map((table) => (
            <TabsTrigger key={table.value} value={table.value}>
              {table.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tables.map((table) => (
          <TabsContent key={table.value} value={table.value}>
            <div className="rounded-md border">
              <DataTable 
                columns={table.columns} 
                data={data} 
                onDataChange={setData}
                loading={loading}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Сохранить изменения</Button>
      </div>
    </div>
  );
}