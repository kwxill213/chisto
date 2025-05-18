// app/api/admin/support/tickets/[id]/status/route.ts
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/drizzle';
import { ticketStatuses, supportTickets } from '@/drizzle/schema';

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
  const { id } = await context.params;

    const { status: statusName } = await request.json();
    
    // Находим статус по имени
    const status = await db.select()
      .from(ticketStatuses)
      .where(eq(ticketStatuses.name, statusName))
      .then(res => res[0]);

    if (!status) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Обновляем тикет
    await db.update(supportTickets)
      .set({ 
        statusId: status.id,
        updatedAt: new Date(),
      })
      .where(eq(supportTickets.id, Number(id)));

    // Получаем обновленный тикет
    const updatedTicket = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.id, Number(id)))
      .then(res => res[0]);

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}