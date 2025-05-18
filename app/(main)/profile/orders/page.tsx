// app/profile/orders/page.tsx
'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Order } from '@/lib/types';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          setOrders(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  if (!isAuthenticated || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мои заказы</h1>
        <Button onClick={() => router.push('/services')}>
          Создать новый заказ
        </Button>
      </div>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {`Заказ №` + order.id || 'Без названия'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {order.date
                        ? new Date(order.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : ''}
                    </p>
                  </div>
                  <span className="font-bold">
                    {order.totalPrice?.toLocaleString('ru-RU') || 0} ₽
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Адрес</p>
                    <p>{order.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Статус</p>
                    <p>
                      {order.status?.description || 'Неизвестно'}
                    </p>
                    {order.status?.id === 1 && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="mt-2"
                        onClick={async () => {
                          const res = await fetch('/api/orders', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderId: order.id }),
                          });
                          if (res.ok) {
                            setOrders(orders =>
                              orders.map(o =>
                                o.id === order.id
                                  ? { ...o, status: { ...o.status, id: 5, description: 'Отменён' } }
                                  : o
                              )
                            );
                          }
                        }}
                      >
                        Отменить
                      </Button>
                    )}
                  </div>
                  {order.status?.id !== 5 && (
                    <div>
                      <p className="text-sm text-gray-500">Оплата</p>
                      <p className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                        {order.paymentStatus === 'paid' ? 'Оплачен' : 'Ожидает оплаты'}
                      </p>
                      {order.paymentStatus === 'unpaid' && (
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => router.push(`/payment/${order.id}`)}
                        >
                          Оплатить
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">У вас пока нет заказов</p>
          <Button onClick={() => router.push('/services')}>
            Заказать уборку
          </Button>
        </div>
      )}
    </div>
  );
}