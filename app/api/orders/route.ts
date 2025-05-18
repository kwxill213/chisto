// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import db from '@/drizzle';
import { orders, services, orderStatuses } from '@/drizzle/schema';
import { eq, inArray } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const auth = await getAuth(req);
    
    if (!auth || !auth.userId) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    // Получаем все заказы пользователя
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, auth.userId))
      .orderBy(orders.createdAt);

    // Получаем id всех статусов
    const statusIds = userOrders.map(order => order.statusId);

    // Получаем все статусы одним запросом
    const allStatuses = await db
      .select()
      .from(orderStatuses)
      .where(inArray(orderStatuses.id, statusIds));

    // Собираем заказы с объектом status
    const ordersWithStatus = userOrders.map(order => ({
      ...order,
      status: allStatuses.find(st => st.id === order.statusId) || { name: '', description: '' },
      paymentStatus: order.paymentStatusId === 1 ? 'unpaid' : 'paid',
    }));

    return NextResponse.json(ordersWithStatus);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuth(req);
    
    if (!auth || !auth.userId) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const { 
      serviceId, 
      address, 
      propertyType, 
      rooms, 
      square, 
      date, 
      totalPrice,
      comments 
    } = await req.json();

    // Валидация
    if (!serviceId || !address || !propertyType || !date || !totalPrice) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }

    const [newOrder] = await db.insert(orders).values({
      userId: auth.userId,
      serviceId: parseInt(serviceId),
      address,
      propertyTypeId: parseInt(propertyType), // <-- исправлено!
      rooms: rooms || null,
      square: square || null,
      date: new Date(date),
      totalPrice,
      comments: comments || null,
      status: 'pending',
      paymentStatus: 'unpaid',
    }).$returningId();

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при создании заказа' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await getAuth(req);
    if (!auth || !auth.userId) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Не передан id заказа' }, { status: 400 });
    }

    // Получаем заказ
    const orderArr = await db.select().from(orders).where(eq(orders.id, orderId));
    const order = orderArr[0];
    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }
    if (order.statusId !== 1) {
      return NextResponse.json({ error: 'Заказ нельзя отменить' }, { status: 400 });
    }

    // Обновляем статус на "Отменён" (id = 5)
    await db.update(orders)
      .set({ statusId: 5 })
      .where(eq(orders.id, orderId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order cancel error:', error);
    return NextResponse.json({ error: 'Ошибка сервера при отмене заказа' }, { status: 500 });
  }
}