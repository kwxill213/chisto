// app/admin/support/tickets/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: number;
    name: string;
    email: string;
  } | null;
}

interface Ticket {
  id: number;
  subject: string;
  status: { id: number; name: string };
  user: { id: number; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export default function AdminTicketPage(props: { params: Promise<{ id: string }> }) {
  const { id: ticketId } = use(props.params);
  const { isAuthenticated, id: userId, name: userName, email: userEmail, roleId } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && roleId === 3) {
      fetchTicket();
    }
  }, [isAuthenticated, roleId, ticketId]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/admin/support/tickets/${ticketId}`);
      const data = await res.json();
      setTicket(data);

      await fetch(`/api/admin/support/tickets/${ticketId}/read`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await fetch(`/api/admin/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          senderId: userId,
        }),
      });

      if (ticket?.status.name === 'open') {
        await fetch(`/api/admin/support/tickets/${ticketId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'in_progress' }),
        });
      }

      if (ticket?.user) {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: ticket.user.id,
            title: `Ответ по вашему тикету: ${ticket.subject}`,
            message: `Администратор ответил на ваш тикет. Текст ответа: ${message.substring(0, 50)}...`,
            typeId: 2,
            relatedId: ticket.id,
          }),
        });
      }

      setMessage('');
      fetchTicket();
      setStatus('idle');
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      await fetch(`/api/admin/support/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTicket();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (!isAuthenticated || roleId !== 3) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Доступ запрещен</h1>
        <p>У вас нет прав для просмотра этой страницы</p>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto py-10">Загрузка...</div>;
  }

  if (!ticket) {
    return <div className="container mx-auto py-10">Тикет не найден</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant={
              ticket.status.name === 'open' ? 'destructive'
              : ticket.status.name === 'in_progress' ? 'secondary'
              : 'default'
            }>
              {ticket.status.name}
            </Badge>
            <p className="text-sm text-gray-600">
              Создан: {new Date(ticket.createdAt).toLocaleString()}
            </p>
            {ticket.user && (
              <p className="text-sm text-gray-600">
                От: {ticket.user.name} ({ticket.user.email})
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={ticket.status.name === 'open' ? 'default' : 'outline'}
            onClick={() => updateStatus('open')}
          >
            Открыть
          </Button>
          <Button
            variant={ticket.status.name === 'in_progress' ? 'default' : 'outline'}
            onClick={() => updateStatus('in_progress')}
          >
            В работе
          </Button>
          <Button
            variant={ticket.status.name === 'closed' ? 'default' : 'outline'}
            onClick={() => updateStatus('closed')}
          >
            Закрыть
          </Button>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {ticket.messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-lg ${
              msg.sender?.id === userId
                ? 'bg-blue-50 ml-auto max-w-3xl'
                : 'bg-gray-50 mr-auto max-w-3xl'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium">
                {msg.sender?.id === userId
                  ? 'Вы'
                  : msg.sender?.name || 'Гость'}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
            <p className="whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите ваш ответ..."
          rows={5}
          className="mb-4"
          required
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/support/tickets')}
          >
            Назад
          </Button>
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Отправка...' : 'Отправить ответ'}
          </Button>
        </div>
        {status === 'error' && (
          <p className="mt-2 text-sm text-red-600">
            Ошибка при отправке сообщения
          </p>
        )}
      </form>
    </div>
  );
}