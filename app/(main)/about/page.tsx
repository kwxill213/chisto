'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function AboutPage() {
  const { isAuthenticated } = useAuth();

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
              О компании "Чисто и точка"
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Мы — команда профессионалов, которая заботится о чистоте вашего дома и офиса
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

      {/* О компании */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-center mb-6">Наша история</h2>
            <p className="text-gray-600 mb-8 text-lg">
              "Чисто и точка" была основана в 2018 году с целью предоставления высококачественных клининговых услуг. 
              Начиная с небольшой команды из 5 человек, сегодня мы объединяем более 100 профессионалов, 
              обслуживающих клиентов по всему городу.
            </p>
            <p className="text-gray-600 text-lg">
              Наш подход сочетает современные технологии уборки с индивидуальным вниманием к каждому клиенту, 
              что позволяет нам достигать безупречных результатов в каждом проекте.
            </p>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Наши преимущества</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Гарантия качества</h3>
              <p className="text-gray-600">Мы бесплатно переделаем уборку, если вас что-то не устроит</p>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Профессиональная команда</h3>
              <p className="text-gray-600">Все наши сотрудники проходят обучение и контроль качества</p>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Экологичные средства</h3>
              <p className="text-gray-600">Используем только безопасные и гипоаллергенные материалы</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Цифры */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-sm">Лет на рынке</div>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-sm">Профессионалов</div>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-sm">Довольных клиентов</div>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm">Поддержка клиентов</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Миссия */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Наша миссия</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-6 text-lg">
                Мы стремимся сделать профессиональный клининг доступным для каждого, чтобы вы могли наслаждаться чистотой и уютом без лишних хлопот.
              </p>
              <p className="text-gray-600 text-lg">
                Наша цель — не просто уборка, а создание комфортной среды для жизни и работы наших клиентов. Ваше доверие — наша главная ценность!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl font-bold mb-6"
          >
            Готовы к безупречной чистоте?
          </motion.h2>
          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Оставьте заявку и получите бесплатную консультацию от нашего специалиста
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button asChild size="lg" className="text-lg bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/services">
                Заказать уборку
              </Link>
            </Button>
            <Button asChild size="lg" className="text-lg bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/contacts">
                Связаться с нами
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}