// app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ServiceCard from './components/ServiceCard';
import { motion } from 'framer-motion';

interface Service {
  id: number;
  name: string;
  description: string;
  pricePerSquare: number | null;
  basePrice: number | null;
  duration: number;
  category: string;
  image_url: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [popularServices, setPopularServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularServices = async () => {
      try {
        const response = await fetch('/api/services/popular');
        if (response.ok) {
          const data = await response.json();
          setPopularServices(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularServices();
  }, []);

  return (
    <div className="bg-white">
      {/* Герой-секция */}
      <section className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Профессиональный клининг от <span className="text-blue-200">"Чисто и точка"</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Идеальная чистота вашего дома или офиса с гарантией качества и по доступным ценам
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="text-lg bg-white text-blue-600 hover:bg-gray-100 px-8">
                <Link href="/services">
                  Выбрать услугу
                </Link>
              </Button>
              {!isAuthenticated && (
                            <Button asChild size="lg" className="text-lg bg-white text-blue-600 hover:bg-gray-100 px-8">

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

      {/* Популярные услуги */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-16"
          >
            <motion.span 
              variants={fadeIn}
              className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4"
            >
              Популярное
            </motion.span>
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Наши самые востребованные услуги
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Проверенные решения для вашего дома и офиса
            </motion.p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: staggerContainer
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {popularServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={fadeIn}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mt-16"
          >
            <Button asChild variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8">
              <Link href="/services">
                Смотреть все услуги
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: staggerContainer
            }}
            className="text-center mb-16"
          >
            <motion.span 
              variants={fadeIn}
              className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4"
            >
              Почему мы?
            </motion.span>
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Наши конкурентные преимущества
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: staggerContainer
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Гарантия качества",
                description: "Если результат уборки вас не устроит, мы бесплатно все переделаем в течение 24 часов."
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Быстрая уборка",
                description: "Средняя продолжительность уборки всего 2-3 часа благодаря профессиональному подходу."
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                title: "Экологичные средства",
                description: "Используем только безопасные сертифицированные средства, подходящие для аллергиков."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: staggerContainer
            }}
            className="text-center mb-16"
          >
            <motion.span 
              variants={fadeIn}
              className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4"
            >
              Просто как 1-2-3
            </motion.span>
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Как заказать уборку
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Всего несколько шагов до идеальной чистоты
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: staggerContainer
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              {
                step: "1",
                title: "Выберите услугу",
                description: "Подберите подходящий вариант уборки из нашего каталога"
              },
              {
                step: "2",
                title: "Оформите заказ",
                description: "Укажите адрес и удобное время визита клинера"
              },
              {
                step: "3",
                title: "Оплатите онлайн",
                description: "Безопасная оплата картой через защищенный шлюз"
              },
              {
                step: "4",
                title: "Получите чистоту",
                description: "Наслаждайтесь идеальной чистотой в вашем пространстве"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="text-center"
              >
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Готовы к безупречной чистоте?
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Оставьте заявку и получите бесплатную консультацию нашего специалиста
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button asChild size="lg" className="text-lg bg-white text-blue-600 hover:bg-gray-100 px-8">
                <Link href="/services">
                  Заказать уборку
                </Link>
              </Button>
              <Button asChild size="lg" className="text-lg bg-white text-blue-600 hover:bg-gray-100 px-8">

                <Link href="/contacts">
                  Задать вопрос
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}