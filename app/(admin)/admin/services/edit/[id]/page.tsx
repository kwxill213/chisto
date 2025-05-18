'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id;
  const [form, setForm] = useState({
    name: '',
    description: '',
    basePrice: '',
    pricePerSquare: '',
    categoryId: '',
    duration: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/services')
      .then(res => res.json())
      .then(services => {
        const service = services.find((s: any) => s.id == serviceId);
        if (service) setForm({
          name: service.name || '',
          description: service.description || '',
          basePrice: service.basePrice ?? '',
          pricePerSquare: service.pricePerSquare ?? '',
          categoryId: service.categoryId ?? '',
          duration: service.duration ?? '',
          image_url: service.image_url || '',
        });
      });
  }, [serviceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/services', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: serviceId,
        ...form,
        basePrice: form.basePrice ? Number(form.basePrice) : null,
        pricePerSquare: form.pricePerSquare ? Number(form.pricePerSquare) : null,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        duration: form.duration ? Number(form.duration) : null,
      }),
    });
    setLoading(false);
    if (res.ok) router.push('/admin/services');
  };

  return (
    <form className="space-y-4 max-w-lg mx-auto mt-8" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Редактировать услугу</h2>
      <Input name="name" placeholder="Название" value={form.name} onChange={handleChange} required />
      <textarea
        name="description"
        placeholder="Описание"
        className="border rounded px-3 py-2 w-full"
        value={form.description}
        onChange={handleChange}
        required
      />
      <Input name="basePrice" placeholder="Базовая цена" type="number" value={form.basePrice} onChange={handleChange} />
      <Input name="pricePerSquare" placeholder="Цена за м²" type="number" value={form.pricePerSquare} onChange={handleChange} />
      <Input name="categoryId" placeholder="ID категории" type="number" value={form.categoryId} onChange={handleChange} />
      <Input name="duration" placeholder="Длительность (мин)" type="number" value={form.duration} onChange={handleChange} />
      <Input name="image_url" placeholder="Ссылка на изображение" value={form.image_url} onChange={handleChange} />
      {form.image_url && (
        <img src={form.image_url} alt="service" className="w-24 h-24 object-cover rounded mb-2" />
      )}
      <Button type="submit" disabled={loading}>{loading ? 'Сохранение...' : 'Сохранить'}</Button>
    </form>
  );
}