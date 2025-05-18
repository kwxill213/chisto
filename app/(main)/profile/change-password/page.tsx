// app/profile/change-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
export default function ChangePasswordPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/user/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success('Пароль успешно изменен');
        router.push('/profile');
      } else {
        const error = response.data;
        throw new Error(error?.error || 'Ошибка при смене пароля');
      }
    } catch (error) {
      console.error('Password change error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Произошла ошибка при смене пароля');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="flex justify-center py-12">Необходима авторизация</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Смена пароля</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="currentPassword">Текущий пароль</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="newPassword">Новый пароль</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : null}
          Сменить пароль
        </Button>
      </form>
    </div>
  );
}