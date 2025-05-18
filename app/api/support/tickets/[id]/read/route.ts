// app/api/support/tickets/[id]/read/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { supportMessages, supportTickets } from '@/drizzle/schema';
import { eq, and, ne } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

export async function POST(request: Request, context: { params: { id: string } }) {
  const { id }  = await context.params;
  const auth = await getAuth(request);
  const userId = auth?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Проверяем, что тикет принадлежит пользователю
    const ticket = await db.select()
      .from(supportTickets)
      .where(
        and(
          eq(supportTickets.id, Number(id)),
          eq(supportTickets.userId, Number(userId))
        )
      )
      .then(res => res[0]);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Помечаем все сообщения не от пользователя как прочитанные
    await db.update(supportMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(supportMessages.ticketId, Number(id)),
          eq(supportMessages.isRead, false),
          ne(supportMessages.senderId, Number(userId))
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}