// app/api/property-types/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { propertyTypes } from '@/drizzle/schema';

export async function GET() {
  try {
    const types = await db.select().from(propertyTypes);
    return NextResponse.json(types);
  } catch (error) {
    console.error('Property types fetch error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении типов недвижимости' },
      { status: 500 }
    );
  }
}