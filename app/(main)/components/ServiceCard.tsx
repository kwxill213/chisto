// components/ServiceCard.tsx
import Link from 'next/link';
import { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg">
            {service.basePrice 
              ? `${service.basePrice.toLocaleString('ru-RU')} ₽` 
              : `${service.pricePerSquare} ₽/м²`}
          </span>
          <span className="text-sm text-gray-500">
            ~{Math.floor(service.duration / 60)} ч {service.duration % 60} мин
          </span>
        </div>
        <Button asChild className="w-full">
          <Link href={`/order?serviceId=${service.id}`}>
            Заказать
          </Link>
        </Button>
      </div>
    </div>
  );
}