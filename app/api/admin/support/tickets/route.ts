// app/api/admin/support/tickets/route.ts
import { NextResponse } from 'next/server';

import { eq, and, desc } from 'drizzle-orm';
import db from '@/drizzle';
import { supportTickets, ticketStatuses, supportMessages, usersTable } from '@/drizzle/schema';

export async function GET() {
  try {
    const tickets = await db
      .select({
        id: supportTickets.id,
        subject: supportTickets.subject,
        status: ticketStatuses,
        user: {
          name: usersTable.name,
          email: usersTable.email,
        },
        createdAt: supportTickets.createdAt,
        updatedAt: supportTickets.updatedAt,
        // messages will be fetched separately below
      })
      .from(supportTickets)
      .leftJoin(usersTable, eq(supportTickets.userId, usersTable.id))
      .leftJoin(ticketStatuses, eq(supportTickets.statusId, ticketStatuses.id))
      .orderBy(desc(supportTickets.updatedAt));

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}