import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { userRoles } from '@/drizzle/schema';

export async function GET() {
  const roles = await db.select().from(userRoles);
  return NextResponse.json(roles);
}