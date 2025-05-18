// components/Footer.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-600">Чисто и точка</h3>
            <p className="text-gray-600">
              Профессиональная клининговая служба для дома и бизнеса.
            </p>
            
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Услуги</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Регулярная уборка
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Генеральная уборка
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Мойка окон
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Компания</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  О нас
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Контакты</h4>
            <ul className="space-y-2">
              <li className="text-gray-600">г. Москва, ул. Примерная, д. 1</li>
              <li>
                <a href="mailto:info@chistoitochka.ru" className="text-gray-600 hover:text-blue-600 transition-colors">
                  info@chistoitochka.ru
                </a>
              </li>
              <li>
                <a href="tel:+79991234567" className="text-gray-600 hover:text-blue-600 transition-colors">
                  +7 (999) 123-45-67
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Чисто и точка. Все права защищены.
          </p>

        </div>
      </div>
    </footer>
  );
}