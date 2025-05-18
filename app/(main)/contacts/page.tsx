// app/contacts/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const subjectOptions = [
  { value: 'feedback', label: 'Общий вопрос' },
  { value: 'service', label: 'Вопрос по услуге' },
  { value: 'order', label: 'Вопрос по заказу' },
  { value: 'complaint', label: 'Жалоба' },
  { value: 'suggestion', label: 'Предложение' },
];

export default function ContactsPage() {
  const { name, email, id, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: name || '',
    email: email || '',
    message: '',
    subject: 'feedback' // Добавляем тему обращения
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Получаем русское название темы
    const subjectLabel = subjectOptions.find(opt => opt.value === form.subject)?.label || form.subject;

    try {
      // Создаем тикет поддержки
      const ticketRes = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subjectLabel, // <-- русское название
          userId: id || null,
          name: form.name,
          email: form.email
        })
      });

      if (!ticketRes.ok) {
        throw new Error('Failed to create ticket');
      }

      const ticketData = await ticketRes.json();
      const ticketId = ticketData.id;

      // Добавляем сообщение к тикету
      const messageRes = await fetch('/api/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          message: form.message,
          senderId: id || null,
          senderEmail: email || form.email,
          senderName: name || form.name
        })
      });

      if (messageRes.ok) {
        setStatus('success');
        setForm(prev => ({ ...prev, message: '' }));
        
        // Отправляем уведомление администратору
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 1, // ID администратора
            title: 'Новое обращение в поддержку',
            message: `Получено новое сообщение от ${form.name} (${form.email})`,
            typeId: 2, // ID типа уведомления "support"
            relatedId: ticketId
          })
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white">
      {/* Герой-секция */}
      <section className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Свяжитесь с нами
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Мы всегда рады помочь вам с любыми вопросами о наших услугах
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/services">
                  Наши услуги
                </Link>
              </Button>
              {!isAuthenticated && (
                <Button asChild variant="secondary" size="lg" className="text-lg">
                  <Link href="/register">
                    Стать клиентом
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-black/20 z-0" />
      </section>

      {/* Контактная информация */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Контактная информация</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Телефон</h3>
                      <a href="tel:+79991234567" className="text-blue-600 hover:underline">+7 (999) 123-45-67</a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <a href="mailto:info@chisto.ru" className="text-blue-600 hover:underline">info@chisto.ru</a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Адрес</h3>
                      <p>г. Москва, ул. Примерная, д. 1</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Часы работы</h3>
                      <p>Пн-Пт: 9:00 - 20:00<br />Сб-Вс: 10:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6">Обратная связь</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {!isAuthenticated && (
                    <>
                      <div>
                        <label className="block mb-2 font-medium">Ваше имя</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block mb-2 font-medium">Тема обращения</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      {subjectOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Сообщение</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Опишите ваш вопрос или проблему максимально подробно..."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Отправка...' : 'Отправить сообщение'}
                  </Button>
                  {status === 'success' && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                      Сообщение успешно отправлено! Мы ответим вам в ближайшее время.
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                      Ошибка отправки. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* НУЖНА СРОЧНАЯ УБОРКА??? */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-6">Нужна срочная уборка?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild variant="outline" size="lg" className="text-lg border-white text-black hover:bg-white/10">
                <Link href="/services">
                  Выбрать услугу
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}