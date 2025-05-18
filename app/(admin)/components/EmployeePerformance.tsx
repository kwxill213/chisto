// components/admin/EmployeePerformance.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function EmployeePerformance() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/employee-performance');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch employee performance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Эффективность сотрудников</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completedOrders" fill="#3b82f6" name="Завершенные заказы" />
              <Bar dataKey="averageRating" fill="#10b981" name="Средний рейтинг" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((employee) => (
            <div key={employee.id} className="border rounded-lg p-3">
              <h3 className="font-medium">{employee.name}</h3>
              <p className="text-sm text-gray-600">
                Заказов: {employee.completedOrders} | Рейтинг: {employee.averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Доход: {new Intl.NumberFormat('ru-RU', { 
                  style: 'currency', 
                  currency: 'RUB' 
                }).format(employee.totalRevenue)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}