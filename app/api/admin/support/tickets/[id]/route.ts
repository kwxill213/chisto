// app/api/admin/support/tickets/[id]/route.ts
import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import db from '@/drizzle';
import { supportTickets, ticketStatuses, supportMessages, usersTable } from '@/drizzle/schema';

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
  const { id } = await context.params;

    // Получаем тикет с пользователем и статусом
    const ticketArr = await db
      .select({
        id: supportTickets.id,
        subject: supportTickets.subject,
        status: ticketStatuses,
        user: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
        createdAt: supportTickets.createdAt,
        updatedAt: supportTickets.updatedAt,
      })
      .from(supportTickets)
      .leftJoin(usersTable, eq(supportTickets.userId, usersTable.id))
      .leftJoin(ticketStatuses, eq(supportTickets.statusId, ticketStatuses.id))
      .where(eq(supportTickets.id, Number(id)));

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

    // Собираем итоговый объект
    const result = {
      ...ticket,
      messages,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}