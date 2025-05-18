'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCards } from '../components/StatsCards';
import { DatabaseTables } from '../components/tables/DatabaseTables';
import { EmployeeAssignment, getEmployees, getOrdersWithDetails, OrderWithDetails } from '../components/EmployeeAssignment';
import { EmployeeSchedule, getEmployeeSchedules, ScheduleManagement } from '../components/ScheduleManagement';
import { useEffect, useState } from 'react';
import { User } from '@/lib/types';


export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<EmployeeSchedule[]>([]);

  const refreshOrders = async () => {
    const data = await getOrdersWithDetails();
    setOrders(data);
  };

  const refreshEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };

  const refreshSchedules = async () => {
    const data = await getEmployeeSchedules();
    setSchedules(data);
  };

  useEffect(() => {
    refreshOrders();
    refreshEmployees();
    refreshSchedules();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Административная панель</h1>
      
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
          <TabsTrigger value="scheduling">Назначение заказов и расписание</TabsTrigger>
          {/* <TabsTrigger value="reports">Отчеты</TabsTrigger> */}
          <TabsTrigger value="data">Управление данными</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* <OverviewChart /> */}
            {/* <RecentOrders /> */}
          </div>
        </TabsContent>
        
        <TabsContent value="scheduling" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Назначение работников на заказы</h2>
              <div className="space-y-6">
                {orders
                  .filter(order => !order.employee || Object.keys(order.employee).length === 0)
                  .map((order) => (
                    <div key={order.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Заказ #{order.id}</h3>
                          <p className="text-sm text-gray-600">Адрес - {order.address}</p>
                          <p className="text-sm">
                            {/* Статус: <span className="font-medium">{typeof order.status === 'object' && 'description' in order.status ? order.status.description : String(order.status)}</span> */}
                          </p>
                          {order.employee && (
                            <p className="text-sm">
                              Текущий работник: <span className="font-medium">{order.employee.name}</span>
                            </p>
                          )}
                        </div>
                        <EmployeeAssignment 
                          order={order} 
                          employees={employees} 
                          refreshOrders={refreshOrders} 
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Управление расписанием</h2>
              <ScheduleManagement 
                employees={employees} 
                schedules={schedules} 
                refreshSchedules={refreshSchedules} 
              />
            </div>
          </div>
        </TabsContent>
        
        {/* <TabsContent value="reports" className="space-y-6">
          <EmployeeReports />
        </TabsContent> */}
        
        <TabsContent value="data">
          <DatabaseTables />
        </TabsContent>
      </Tabs>
    </div>
  );
}