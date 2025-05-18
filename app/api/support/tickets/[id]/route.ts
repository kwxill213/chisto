// app/api/support/tickets/[id]/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { supportTickets, ticketStatuses, usersTable, supportMessages } from '@/drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

export async function GET(request: Request, context: { params: { id: string } }) {
  const { id }  = await context.params;
  const auth = await getAuth(request);
  const userId = auth?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Получаем тикет
    const ticketArr = await db
      .select({
        id: supportTickets.id,
        subject: supportTickets.subject,
        status: ticketStatuses,
        createdAt: supportTickets.createdAt,
        updatedAt: supportTickets.updatedAt,
      })
      .from(supportTickets)
      .leftJoin(ticketStatuses, eq(supportTickets.statusId, ticketStatuses.id))
      .where(
        and(
          eq(supportTickets.id, Number(id)),
          eq(supportTickets.userId, Number(userId))
        )
      );

    const ticket = ticketArr[0];
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Получаем сообщения тикета
    const messages = await db
      .select({
        id: supportMessages.id,
        message: supportMessages.message,
        isRead: supportMessages.isRead,
        createdAt: supportMessages.createdAt,
        sender: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
      })
      .from(supportMessages)
      .leftJoin(usersTable, eq(supportMessages.senderId, usersTable.id))
      .where(eq(supportMessages.ticketId, Number(id)))
      .orderBy(desc(supportMessages.createdAt));

    return NextResponse.json({ ...ticket, messages });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}