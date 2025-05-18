'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { User } from '@/lib/types';

export interface ScheduleManagementProps {
  employees: { id: number; name: string }[];
  schedules: EmployeeSchedule[];
  refreshSchedules: () => void;
}

export interface EmployeeSchedule {
  id: number;
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  employee: User;
}

export async function getEmployeeSchedules(): Promise<EmployeeSchedule[]> {
  const response = await fetch('/api/admin/schedule');
  if (!response.ok) {
    throw new Error('Failed to fetch schedules');
  }
  return response.json();
}

export async function updateEmployeeSchedule(schedule: Omit<EmployeeSchedule, 'id' | 'employee'>): Promise<void> {
  const response = await fetch('/api/admin/schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schedule),
  });

  if (!response.ok) {
    throw new Error('Failed to update schedule');
  }
}


export function ScheduleManagement({ employees, schedules, refreshSchedules }: ScheduleManagementProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSchedule = async () => {
    if (!selectedEmployee || !date) return;
    
    setIsLoading(true);
    try {
      await updateEmployeeSchedule({
        employeeId: parseInt(selectedEmployee),
        date: date.toISOString(),
        startTime,
        endTime,
        isAvailable,
      });
      toast('Расписание обновлено');
      refreshSchedules();
    } catch (error) {
      toast.error('Не удалось обновить расписание');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Выберите работника</Label>
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

      <div className="space-y-2">
        <Label>Выберите дату</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Время начала</Label>
          <Input 
            type="time" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>Время окончания</Label>
          <Input 
            type="time" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="availability"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <Label htmlFor="availability">Доступен для работы</Label>
      </div>

      <Button onClick={handleSaveSchedule} disabled={isLoading || !selectedEmployee || !date}>
        {isLoading ? 'Сохранение...' : 'Сохранить расписание'}
      </Button>
    </div>
  );
}