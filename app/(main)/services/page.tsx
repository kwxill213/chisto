// app/services/page.tsx
'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Service } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

// Запасная SVG-иконка, если нет изображения
const DefaultServiceIcon = () => (
  <svg className="w-10 h-10 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default function ServicesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleOrder = (serviceId: number) => {
    setSelectedService(serviceId);
    router.push(`/order?serviceId=${serviceId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Наши услуги</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Профессиональные клининговые решения для вашего дома и офиса
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: staggerContainer
            }}
            className="mb-12"
          >
            <motion.span 
              variants={fadeIn}
              className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4"
            >
              Полный спектр услуг
            </motion.span>
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Выберите подходящий вариант
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Мы предлагаем широкий выбор профессиональных клининговых услуг для любых потребностей
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeIn}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
                  <CardHeader className="pb-0">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
                      {service.image_url ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={service.image_url}
                            alt={service.name}
                            fill
                            className="object-cover rounded-lg"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <DefaultServiceIcon />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                    <span className="text-sm text-blue-600 font-medium">{service.category}</span>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <span className="block text-sm text-gray-500">Стоимость:</span>
                        <span className="font-bold text-lg">
                          {service.basePrice 
                            ? `${service.basePrice} ₽` 
                            : `${service.pricePerSquare} ₽/м²`}
                        </span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Длительность:</span>
                        <span className="font-medium">
                          ~{Math.floor(service.duration / 60)} ч {service.duration % 60} мин
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleOrder(service.id)}
                      className="w-full py-6 text-lg"
                      size="lg"
                    >
                      Заказать услугу
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}