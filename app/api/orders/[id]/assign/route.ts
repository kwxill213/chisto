import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/drizzle';
import { orders } from '@/drizzle/schema';

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } =  context.params;
    const { employeeId } = await request.json();

    console.log(id, parseInt(employeeId));
    
    await db.update(orders)
      .set({ employeeId: parseInt(employeeId) })
      .where(eq(orders.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to assign employee' },
      { status: 500 }
    );
  }
}