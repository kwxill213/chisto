'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: 1 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) router.push('/admin/users');
    // Можно добавить обработку ошибок
  };

  return (
    <form className="space-y-4 max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Добавить пользователя</h2>
      <Input
        placeholder="Имя"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
      />
      <Input
        placeholder="Email"
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
      />
      <Input
        placeholder="Пароль"
        type="password"
        value={form.password}
        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
      />
      <Input
        placeholder="ID роли (например, 1)"
        type="number"
        value={form.roleId}
        onChange={e => setForm(f => ({ ...f, roleId: Number(e.target.value) }))}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Создание...' : 'Создать'}
      </Button>
    </form>
  );
}