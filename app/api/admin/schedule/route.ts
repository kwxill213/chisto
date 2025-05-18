import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { employeeSchedules } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const data = await db.select().from(employeeSchedules);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    let { employeeId, date, startTime, endTime, isAvailable } = await req.json();
    if (!employeeId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    // Преобразуем date в Date, если это строка
    if (typeof date === 'string') {
      date = new Date(date);
    }

    const [event] = await db
      .insert(employeeSchedules)
      .values({ employeeId, date, startTime, endTime, isAvailable })
      .$returningId();
    return NextResponse.json(event);
  } catch (error) {
    console.error('Schedule POST error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, employeeId, date, startTime, endTime, isAvailable } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Не передан id события' }, { status: 400 });
    }
    await db
      .update(employeeSchedules)
      .set({ employeeId, date, startTime, endTime, isAvailable })
      .where(eq(employeeSchedules.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Нет id' }, { status: 400 });
    await db.delete(employeeSchedules).where(eq(employeeSchedules.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}