// app/api/support/tickets/route.ts
import db from '@/drizzle';
import { ticketStatuses, supportTickets, supportMessages } from '@/drizzle/schema';
import { desc, eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';

export async function GET(request: Request) {
  // Получаем userId через getAuth
  const auth = await getAuth(request);
  const userId = auth?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Получаем все тикеты пользователя
    const tickets = await db
      .select({
        id: supportTickets.id,
        subject: supportTickets.subject,
        status: ticketStatuses,
        createdAt: supportTickets.createdAt,
        updatedAt: supportTickets.updatedAt,
      })
      .from(supportTickets)
      .leftJoin(ticketStatuses, eq(supportTickets.statusId, ticketStatuses.id))
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.updatedAt));

    // Получаем все сообщения для этих тикетов
    const ticketIds = tickets.map(t => t.id);
    const messages = ticketIds.length
      ? await db
          .select({
            id: supportMessages.id,
            ticketId: supportMessages.ticketId,
            isRead: supportMessages.isRead,
          })
          .from(supportMessages)
          .where(inArray(supportMessages.ticketId, ticketIds))
      : [];

    // Добавляем сообщения к тикетам
    const ticketsWithMessages = tickets.map(ticket => ({
      ...ticket,
      messages: messages.filter(m => m.ticketId === ticket.id),
    }));

    return NextResponse.json(ticketsWithMessages);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { subject, userId, name, email } = await request.json();

    // Находим статус "open"
    const status = await db.select().from(ticketStatuses)
      .where(eq(ticketStatuses.name, 'open'))
      .then(res => res[0]);

    if (!status) {
      return NextResponse.json({ error: 'Status not found' }, { status: 400 });
    }

    // Создаем тикет
    const [ticket] = await db.insert(supportTickets).values({
      subject,
      userId: userId || null,
      statusId: status.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }).$returningId();

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}