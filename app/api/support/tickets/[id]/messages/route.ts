// app/api/support/tickets/[id]/messages/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { supportMessages, supportTickets } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
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

    const { message } = await request.json();

    const [newMessage] = await db.insert(supportMessages).values({
      ticketId: Number(id),
      senderId: Number(userId),
      message,
      isRead: false,
      createdAt: new Date(),
    }).$returningId();

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}