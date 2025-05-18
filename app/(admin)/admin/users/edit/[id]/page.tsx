'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  const [form, setForm] = useState({
    name: '',
    email: '',
    roleId: 1,
    phone: '',
    avatar: '',
  });
  const [roles, setRoles] = useState<{ id: number; name: string; description: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Загрузка пользователя и ролей
  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(users => {
        const user = users.find((u: any) => u.id == userId);
        if (user) setForm({
          name: user.name,
          email: user.email,
          roleId: user.roleId || 1,
          phone: user.phone || '',
          avatar: user.avatar || '',
        });
        if (user?.avatar) setAvatarPreview(user.avatar);
      });
    fetch('/api/admin/roles')
      .then(res => res.json())
      .then(setRoles);
  }, [userId]);

  // Загрузка аватара
  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    // Загрузка на сервер
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.imageUrl) {
      setForm(f => ({ ...f, avatar: data.imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, ...form }),
    });
    setLoading(false);
    if (res.ok) router.push('/admin/users');
    // Можно добавить обработку ошибок
  };

  return (
    <form className="space-y-4 max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Редактировать пользователя</h2>
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
      <div>
        <label className="block mb-1 text-sm font-medium">Роль</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={form.roleId}
          onChange={e => setForm(f => ({ ...f, roleId: Number(e.target.value) }))}
        >
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.description || role.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Аватар</label>
        {/* Показываем текущий аватар, если есть */}
        {form.avatar && !avatarPreview && (
          <img
            src={form.avatar}
            alt="avatar"
            className="mb-2 w-24 h-24 object-cover rounded-full border"
          />
        )}
        {/* Показываем превью нового аватара, если выбран */}
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="avatar preview"
            className="mb-2 w-24 h-24 object-cover rounded-full border"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Сохранение...' : 'Сохранить'}
      </Button>
    </form>
  );
}