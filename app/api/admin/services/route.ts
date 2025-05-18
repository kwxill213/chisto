import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { services } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const data = await db.select().from(services);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const { name, description, basePrice, pricePerSquare, categoryId, duration, image_url } = await req.json();
    if (!name || !description) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }
    const [service] = await db
      .insert(services)
      .values({ name, description, basePrice, pricePerSquare, categoryId, duration, image_url })
      .$returningId();
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, name, description, basePrice, pricePerSquare, categoryId, duration, image_url } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Не передан id услуги' }, { status: 400 });
    }
    await db
      .update(services)
      .set({ name, description, basePrice, pricePerSquare, categoryId, duration, image_url })
      .where(eq(services.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Нет id' }, { status: 400 });
    await db.delete(services).where(eq(services.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}