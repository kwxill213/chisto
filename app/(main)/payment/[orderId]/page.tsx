// app/payment/[orderId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
interface Order {
  id: number;
  service: {
    name: string;
  };
  address: string;
  date: string;
  totalPrice: number;
  paymentStatus: string;
}

export default function PaymentPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          setOrder(await response.json());
        } else {
          toast.error('Нет доступа к заказу');
          router.replace('/forbidden');
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        toast.error('Не удалось загрузить данные заказа');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [isAuthenticated, orderId, router]);

  const handlePayment = async (method: 'card' | 'cash') => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/payment/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method }),
      });

      if (response.ok) {
        toast.success('Оплата прошла успешно!');
        router.push('/profile/orders');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при оплате');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-12">Заказ не найден</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Оплата заказа</h1>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <h2 className="text-xl font-semibold">Детали заказа</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><span className="font-medium">Услуга:</span> {order.service.name}</p>
            <p><span className="font-medium">Адрес:</span> {order.address}</p>
            <p><span className="font-medium">Дата:</span> {new Date(order.date).toLocaleString()}</p>
            <p><span className="font-medium">Статус оплаты:</span> 
              <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                {order.paymentStatus === 'paid' ? ' Оплачен' : ' Ожидает оплаты'}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-xl font-semibold">Способы оплаты</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium mb-2">Оплата картой онлайн</h3>
              <Button 
                onClick={() => handlePayment('card')}
                className="w-full"
                disabled={order.paymentStatus === 'paid' || processing}
              >
                {processing ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : null}
                Оплатить {order.totalPrice} ₽
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <Button
                variant="destructive"
                className="w-full"
                disabled={order.paymentStatus === 'paid'}
                onClick={async () => {
                  const res = await fetch('/api/orders', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId: order.id }),
                  });
                  if (res.ok) {
                    toast.success('Заказ отменён');
                    router.push('/profile/orders');
                  } else {
                    toast.error('Не удалось отменить заказ');
                  }
                }}
              >
                Отменить заказ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}