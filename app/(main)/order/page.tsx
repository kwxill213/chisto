// app/order/page.tsx
'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Service, PropertyType } from '@/lib/types';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const { isAuthenticated, id: userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [formData, setFormData] = useState({
    address: '',
    propertyType: '',
    rooms: 1,
    square: 50,
    date: '',
    time: '',
    comments: '',
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (serviceId) {
          const serviceResponse = await fetch(`/api/services/${serviceId}`);
          if (serviceResponse.ok) {
            const data = await serviceResponse.json();
            setService(data);
            const initialPrice = data.basePrice || (data.pricePerSquare || 0) * formData.square;
            setTotalPrice(initialPrice);
          }
        }

        const typesResponse = await fetch('/api/property-types');
        if (typesResponse.ok) {
          setPropertyTypes(await typesResponse.json());
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router, serviceId]);

  useEffect(() => {
    if (service) {
      const price = service.basePrice 
        ? service.basePrice 
        : (service.pricePerSquare || 0) * formData.square;
      setTotalPrice(price);
    }
  }, [formData.square, service]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rooms' || name === 'square' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          userId,
          ...formData,
          totalPrice,
          date: `${formData.date}T${formData.time}:00.000Z`,
        }),
      });

      if (response.ok) {
        const order = await response.json();
        toast.success('Заказ успешно создан!');
        router.push(`/payment/${order.id}`);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при создании заказа');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Услуга не найдена</h1>
        <Button className="mt-4" onClick={() => router.push('/services')}>
          Вернуться к услугам
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Оформление заказа</h1>
            <p className="text-lg">Заполните форму ниже, чтобы оформить заказ</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100"
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Выбранная услуга</h2>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="font-bold text-blue-600">
                {service.basePrice !== null && service.basePrice !== undefined
                  ? `${service.basePrice.toLocaleString('ru-RU')} ₽`
                  : service.pricePerSquare !== null && service.pricePerSquare !== undefined
                    ? `${service.pricePerSquare} ₽/м²`
                    : 'Цена не указана'}
              </span>
            </div>
          </div>
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700">Адрес *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="focus-visible:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-700">Тип недвижимости *</Label>
              <Select 
                onValueChange={(value) => setFormData({...formData, propertyType: value})}
                required
              >
                <SelectTrigger className="focus-visible:ring-blue-500">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {!service.basePrice && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="square" className="text-gray-700">Площадь (м²) *</Label>
                  <div className="relative">
                    <Input
                      id="square"
                      name="square"
                      type="number"
                      min="10"
                      value={formData.square}
                      onChange={handleChange}
                      required
                      className="focus-visible:ring-blue-500"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500">м²</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rooms" className="text-gray-700">Количество комнат *</Label>
                  <Input
                    id="rooms"
                    name="rooms"
                    type="number"
                    min="1"
                    value={formData.rooms}
                    onChange={handleChange}
                    required
                    className="focus-visible:ring-blue-500"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-700">Дата *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={handleChange}
                required
                className="focus-visible:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time" className="text-gray-700">Время *</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="focus-visible:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-gray-700">Комментарии (необязательно)</Label>
            <Input
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Особенности доступа, домашние животные и т.д."
              className="focus-visible:ring-blue-500"
            />
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Итоговая стоимость</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {service.basePrice ? (
                  <p className="text-gray-600">Фиксированная цена за услугу</p>
                ) : service.pricePerSquare !== null && service.pricePerSquare !== undefined ? (
                  <div className="space-y-1">
                    <p className="text-gray-600">Расчет по площади:</p>
                    <p className="text-sm text-gray-500">
                      {formData.square} м² × {service.pricePerSquare} ₽/м²
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-red-500">Цена не указана</p>
                )}
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                <span className="font-medium text-gray-700">Итого:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {totalPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full py-6 text-lg mt-6"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Обработка...
              </>
            ) : (
              'Перейти к оплате'
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}