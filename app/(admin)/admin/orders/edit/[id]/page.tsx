'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;
  
  const [form, setForm] = useState({
    userId: '',
    employeeId: '',
    serviceId: '',
    propertyTypeId: '',
    statusId: '',
    paymentStatusId: '',
    paymentMethodId: '',
    address: '',
    square: '',
    totalPrice: '',
    date: '',
    comments: ''
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<any[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const responses = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/users/employees'),
          fetch('/api/admin/services'),
          fetch('/api/admin/data/propertyTypes'),
          fetch('/api/admin/data/orderStatuses'),
          fetch('/api/admin/data/paymentStatuses'),
          fetch('/api/admin/data/paymentMethods'),
        ]);

        const data = await Promise.all(responses.map(async res => {
          if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
          return await res.json();
        }))

        const [users, employees, services, propertyTypes, orderStatuses, paymentStatuses, paymentMethods] = data;
        
        setUsers(Array.isArray(users) ? users : []);
        setEmployees(Array.isArray(employees) ? employees : []);
        setServices(Array.isArray(services) ? services : []);
        setPropertyTypes(Array.isArray(propertyTypes) ? propertyTypes : []);
        setOrderStatuses(Array.isArray(orderStatuses) ? orderStatuses : []);
        setPaymentStatuses(Array.isArray(paymentStatuses) ? paymentStatuses : []);
        setPaymentMethods(Array.isArray(paymentMethods) ? paymentMethods : []);

        // Загрузка данных заказа
        const orderRes = await fetch(`/api/admin/orders?id=${orderId}`);
        if (!orderRes.ok) throw new Error('Ошибка загрузки данных заказа');
        const order = await orderRes.json();
        
        if (order) {
          setForm({
            userId: order.userId?.toString() || '',
            employeeId: order.employeeId?.toString() || '',
            serviceId: order.serviceId?.toString() || '',
            propertyTypeId: order.propertyTypeId?.toString() || '',
            statusId: order.statusId?.toString() || '',
            paymentStatusId: order.paymentStatusId?.toString() || '',
            paymentMethodId: order.paymentMethodId?.toString() || '',
            address: order.address || '',
            square: order.square?.toString() || '',
            totalPrice: order.totalPrice?.toString() || '',
            date: order.date ? new Date(order.date).toISOString().slice(0, 16) : '',
            comments: order.comments || ''
          });
        }
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [orderId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          userId: form.userId ? Number(form.userId) : null,
          employeeId: form.employeeId ? Number(form.employeeId) : null,
          serviceId: form.serviceId ? Number(form.serviceId) : null,
          propertyTypeId: form.propertyTypeId ? Number(form.propertyTypeId) : null,
          statusId: form.statusId ? Number(form.statusId) : null,
          paymentStatusId: form.paymentStatusId ? Number(form.paymentStatusId) : null,
          paymentMethodId: form.paymentMethodId ? Number(form.paymentMethodId) : null,
          address: form.address,
          square: form.square ? Number(form.square) : null,
          totalPrice: form.totalPrice ? Number(form.totalPrice) : null,
          date: form.date,
          comments: form.comments
        }),
      });
      
      if (!res.ok) throw new Error('Ошибка сохранения заказа');
      
      router.push('/admin/orders');
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      setError('Не удалось сохранить изменения. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Загрузка данных...</div>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>{error}</p>
        <Button 
          className="mt-4" 
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-4 max-w-2xl mx-auto mt-8 p-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Редактировать заказ #{orderId}</h2>
      
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label className="block mb-1">Клиент</label>
        <Select 
          name="userId" 
          value={form.userId} 
          onValueChange={(value) => handleSelectChange('userId', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите клиента" />
          </SelectTrigger>
          <SelectContent>
            {users.length > 0 ? (
              users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name} ({user.email})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Нет доступных клиентов
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-1">Сотрудник</label>
        <Select 
          name="employeeId" 
          value={form.employeeId} 
          onValueChange={(value) => handleSelectChange('employeeId', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите сотрудника" />
          </SelectTrigger>
          <SelectContent>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Нет доступных сотрудников
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-1">Услуга</label>
        <Select 
          name="serviceId" 
          value={form.serviceId} 
          onValueChange={(value) => handleSelectChange('serviceId', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите услугу" />
          </SelectTrigger>
          <SelectContent>
            {services.length > 0 ? (
              services.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  {service.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Нет доступных услуг
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-1">Тип недвижимости</label>
        <Select 
          name="propertyTypeId" 
          value={form.propertyTypeId} 
          onValueChange={(value) => handleSelectChange('propertyTypeId', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите тип" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.length > 0 ? (
              propertyTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Нет доступных типов
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <Input 
        name="address" 
        placeholder="Адрес" 
        value={form.address} 
        onChange={handleChange} 
        required 
        disabled={loading}
      />
      
      <Input 
        name="square" 
        placeholder="Площадь (м²)" 
        type="number" 
        value={form.square} 
        onChange={handleChange} 
        required 
        disabled={loading}
      />
      
      <Input 
        name="totalPrice" 
        placeholder="Общая стоимость" 
        type="number" 
        value={form.totalPrice} 
        onChange={handleChange} 
        required 
        disabled={loading}
      />
      
      <div>
        <label className="block mb-1">Дата и время</label>
        <Input 
          name="date" 
          type="datetime-local" 
          value={form.date} 
          onChange={handleChange} 
          required 
          disabled={loading}
        />
      </div>

      <div>
        <label className="block mb-1">Статус заказа</label>
        <Select 
          name="statusId" 
          value={form.statusId} 
          onValueChange={(value) => handleSelectChange('statusId', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите статус" />
          </SelectTrigger>
          <SelectContent>
            {orderStatuses.length > 0 ? (
              orderStatuses.map((status) => (
                <SelectItem key={status.id} value={status.id.toString()}>
                  {status.description}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Нет доступных статусов
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-1">Статус оплаты</label>
        <Select 
          name="paymentStatusId" 
          value={form.paymentStatusId} 
          onValueChange={(value) => handleSelectChange('paymentStatusId', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите статус оплаты" />
          </SelectTrigger>
          <SelectContent>
            {paymentStatuses.length > 0 ? (
              paymentStatuses.map((status) => (
                <SelectItem key={status.id} value={status.id.toString()}>
                  {status.description}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Нет доступных статусов
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-1">Способ оплаты</label>
        <Select 
          name="paymentMethodId" 
          value={form.paymentMethodId} 
          onValueChange={(value) => handleSelectChange('paymentMethodId', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите способ оплаты" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id.toString()}>
                  {method.description}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Нет доступных методов
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <textarea
        name="comments"
        placeholder="Комментарии"
        className="border rounded px-3 py-2 w-full"
        value={form.comments}
        onChange={handleChange}
        disabled={loading}
        rows={3}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/admin/orders')}
          disabled={loading}
        >
          Отмена
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </div>
    </form>
  );
}