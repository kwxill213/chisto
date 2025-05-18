// app/api/services/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { services } from '@/drizzle/schema';

export async function GET() {
  try {
    const allServices = await db.select().from(services);
    return NextResponse.json(allServices);
  } catch (error) {
    console.error('Services fetch error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении услуг' },
      { status: 500 }
    );
  }
}