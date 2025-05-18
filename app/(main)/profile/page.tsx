// app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Edit, Save, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { 
    id, 
    name, 
    email, 
    phone, 
    avatar, 
    isAuthenticated, 
    setUser 
  } = useAuth();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: name || '',
    email: email || '',
    phone: phone || '',
    avatar: avatar || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(avatar || '');

  useEffect(() => {
    if (name && email && phone) {
      setFormData({
        name,
        email,
        phone,
        avatar: avatar || ''
      });
      setAvatarPreview(avatar || '');
    }
  }, [name, email, phone, avatar]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.imageUrl) {
          setAvatarPreview(data.imageUrl);
          setFormData(prev => ({ ...prev, avatar: data.imageUrl }));
        } else {
          toast.error(data.error || 'Ошибка загрузки изображения');
        }
      } catch (err) {
        toast.error('Ошибка загрузки изображения');
      }
    }
  };

const handleSave = async () => {
  setIsLoading(true);
  try {
    const response = await api.post(
      '/user/update',
      {
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar
      },
      { withCredentials: true }
    );

    if (response.status >= 200 && response.status < 300) {
      const { user } = response.data;
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
        phone: user.phone,
        avatar: user.avatar
      });
      setIsEditing(false);
      toast.success('Профиль успешно обновлен');
    } else {
      const error = response.data;
      throw new Error(error.error || 'Ошибка при обновлении профиля');
    }
  } catch (error) {
    console.error('Update error:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Произошла неизвестная ошибка');
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: name || '',
      email: email || '',
      phone: phone || '',
      avatar: avatar || ''
    });
    setAvatarPreview(avatar || '');
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setOrders([]);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Профиль</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center mb-6">
            {isEditing ? (
              <>
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="Аватар" />
                    ) : (
                      <AvatarFallback>
                        {name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer">
                    <Edit size={16} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </>
            ) : (
              <Avatar className="w-24 h-24 mb-4">
                {avatar ? (
                  <AvatarImage src={avatar} alt="Аватар" />
                ) : (
                  <AvatarFallback>
                    {name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            )}
            
            {isEditing ? (
              <div className="w-full space-y-4">
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">{name}</h2>
                <p className="text-gray-600 mb-1">{email}</p>
                {phone && <p className="text-gray-600">{phone}</p>}
              </>
            )}
          </div>

          {isEditing ? (
            <div className="flex space-x-2">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Сохранить
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Отмена
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="w-full"
            >
              <Edit className="mr-2 h-4 w-4" />
              Редактировать профиль
            </Button>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Мои заказы</h2>
            {orders.length > 0 ? (
              <>
                <div className="space-y-4">
                  {orders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            Заказ #{order.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className="font-bold">
                          {order.totalPrice.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm">
                          <span className="text-gray-500">Адрес:</span> {order.address}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Статус:</span> {order.status?.description || 'Неизвестно'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {orders.length > 2 && (
                  <div className="text-center mt-4">
                    <Button onClick={() => router.push('/profile/orders')}>
                      Показать все
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">У вас пока нет заказов</p>
                <Button onClick={() => router.push('/services')}>
                  Заказать уборку
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Безопасность</h2>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/profile/change-password')}
            >
              Сменить пароль
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}