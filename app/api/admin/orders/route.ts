import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { orders, orderStatuses, usersTable,  } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    // Получить один заказ по id
    const data = await db
      .select()
      .from(orders)
      .where(eq(orders.id, Number(id)));
    return NextResponse.json(data[0] || null);
  }

  const data = await db
    .select({
      id: orders.id,
      user: usersTable.name,
      userId: orders.userId,
      status: orderStatuses.description,
      statusId: orders.statusId,
      totalPrice: orders.totalPrice,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(usersTable, eq(orders.userId, usersTable.id))
    .leftJoin(orderStatuses, eq(orders.statusId, orderStatuses.id));
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const { userId, statusId, totalPrice } = await req.json();
    if (!userId || !statusId || !totalPrice) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }
    const [order] = await db
      .insert(orders)
      .values({ 
        userId, 
        statusId, 
        totalPrice, 
        date: new Date(),
        serviceId: 1,
        propertyTypeId: 1,
        address: '',
        square: 0
      })
      .$returningId();
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, userId, statusId, totalPrice } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Не передан id заказа' }, { status: 400 });
    }
    await db
      .update(orders)
      .set({ userId, statusId, totalPrice })
      .where(eq(orders.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Нет id' }, { status: 400 });
    await db.delete(orders).where(eq(orders.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}