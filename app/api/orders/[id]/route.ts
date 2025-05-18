import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { orders, services, orderStatuses } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  content: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuth(req);
    if (!auth || !auth.userId) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const { id } = await content.params;
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Некорректный id заказа' }, { status: 400 });
    }

    // Получаем заказ
    const orderArr = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));
    const order = orderArr[0];

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    // Проверяем владельца
    if (order.userId !== auth.userId) {
      return NextResponse.json({ error: 'Нет доступа к заказу' }, { status: 403 });
    }

    // Получаем услугу и статус
    const serviceArr = await db.select().from(services).where(eq(services.id, order.serviceId));
    const service = serviceArr[0];
    const statusArr = await db.select().from(orderStatuses).where(eq(orderStatuses.id, order.statusId));
    const status = statusArr[0];

    return NextResponse.json({
      ...order,
      service: { name: service?.name || '' },
      status: status ? { id: status.id, description: status.description } : null,
      paymentStatus: order.paymentStatusId === 2 ? 'paid' : 'unpaid',
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении заказа' },
      { status: 500 }
    );
  }
}