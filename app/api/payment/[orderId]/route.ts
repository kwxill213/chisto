// app/api/payment/[orderId]/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import db from '@/drizzle';
import { orders } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  req: Request,
  content: { params: Promise<{orderId: string}>}
) {
  try {
    const orderIdParam = (await content.params).orderId;
    const orderId = Number(orderIdParam);
    const auth = await getAuth(req);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Некорректный идентификатор заказа' },
        { status: 400 }
      );
    }

    if (!auth || !auth.userId) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const { method } = await req.json();

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order || order.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      );
    }
    if (order.paymentStatusId === 2) {
      return NextResponse.json(
        { error: 'Заказ уже оплачен' },
        { status: 400 }
      );
    }
    let paymentStatusId = method === 'card' || method === 'online' ? 2 : 1; // 2 = Оплачен, 1 = Не оплачен
    let paymentMethodId: number;

    if (method === 'cash') paymentMethodId = 1;
    else if (method === 'card') paymentMethodId = 2;
    else if (method === 'online') paymentMethodId = 3;
    else return NextResponse.json({ error: 'Некорректный способ оплаты' }, { status: 400 });

    await db.update(orders)
      .set({
        paymentStatusId,
        paymentMethodId,
      })
      .where(eq(orders.id, orderId));

    const [updatedOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при обработке платежа' },
      { status: 500 }
    );
  }
}