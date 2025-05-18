// app/api/services/[id]/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { services } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: Request,
  content: { params: Promise<{id: string}>}
) {
  try {
    const id = (await content.params).id;

    const servicesArr = await db
      .select()
      .from(services)
      .where(eq(services.id, parseInt(id)));

    const service = servicesArr[0];

    if (!service) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Service fetch error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении услуги' },
      { status: 500 }
    );
  }
}
