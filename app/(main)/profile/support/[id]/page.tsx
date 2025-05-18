// app/account/support/[id]/page.tsx
'use client';

import { use, useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
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
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export default function UserTicketPage(props: { params: Promise<{ id: string }> }) {
  const { id: ticketId } = use(props.params);
  const { id, isAuthenticated } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ticketId]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}`);
      const data = await res.json();
      setTicket(data);

      // Помечаем сообщения как прочитанные
      await fetch(`/api/support/tickets/${ticketId}/read`, {
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
      await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          senderId: id,
        }),
      });

      setMessage('');
      fetchTicket();
      setStatus('idle');
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Необходима авторизация</h1>
        <p>Пожалуйста, войдите в систему для просмотра обращения</p>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto py-10">Загрузка...</div>;
  }

  if (!ticket) {
    return <div className="container mx-auto py-10">Обращение не найдено</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant={
              ticket.status?.name === 'open' ? 'destructive'
              : ticket.status?.name === 'in_progress' ? 'outline'
              : 'default'
            }>
              {ticket.status?.name || 'Неизвестно'}
            </Badge>
            <p className="text-sm text-gray-600">
              Создан: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/profile/support')}
        >
          Назад к списку
        </Button>
      </div>

      <div className="space-y-6 mb-8">
        {Array.isArray(ticket.messages) && ticket.messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-lg ${
              msg.sender?.id === id
                ? 'bg-blue-50 ml-auto max-w-3xl'
                : 'bg-gray-50 mr-auto max-w-3xl'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium">
                {msg.sender?.id === id
                  ? 'Вы'
                  : msg.sender?.name || 'Поддержка'}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
            <p className="whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
      </div>

      {ticket.status?.name !== 'closed' && (
        <form onSubmit={handleSubmit} className="max-w-3xl">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите ваше сообщение..."
            rows={5}
            className="mb-4"
            required
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Отправка...' : 'Отправить сообщение'}
            </Button>
          </div>
          {status === 'error' && (
            <p className="mt-2 text-sm text-red-600">
              Ошибка при отправке сообщения
            </p>
          )}
        </form>
      )}
    </div>
  );
}