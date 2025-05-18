'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { Order, User, Service, PropertyType } from '@/lib/types';

interface EmployeeAssignmentProps {
  order: OrderWithDetails;
  employees: { id: number; name: string }[];
  refreshOrders: () => void;
}

export interface OrderWithDetails extends Order {
  user: User;
  employee?: User;
  service: Service;
  propertyType: PropertyType;
}

export async function getEmployees(): Promise<User[]> {
  const response = await fetch('/api/admin/users/employees');
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return response.json();
}

export async function assignEmployeeToOrder(orderId: number, employeeId: number): Promise<void> {
  const response = await fetch(`/api/orders/${orderId}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employeeId }),
  });

  if (!response.ok) {
    throw new Error('Failed to assign employee');
  }
}

export async function getOrdersWithDetails(): Promise<OrderWithDetails[]> {
  const response = await fetch('/api/admin/orders/emp');
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

export function EmployeeAssignment({ order, employees, refreshOrders }: EmployeeAssignmentProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>(order.employee?.id?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedEmployee) return;
    
    setIsLoading(true);
    try {
      await assignEmployeeToOrder(order.id, parseInt(selectedEmployee));
      toast.success('Работник назначен на заказ');
      refreshOrders();
    } catch (error) {
      toast.error('Не удалось назначить работника');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="employee">Назначить работника</Label>
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите работника" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id.toString()}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={handleAssign}
        disabled={isLoading || !selectedEmployee || !!order.employee}
      >
        {isLoading ? 'Назначение...' : 'Назначить'}
      </Button>
    </div>
  );
}