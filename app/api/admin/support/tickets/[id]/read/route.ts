// app/api/admin/support/tickets/[id]/read/route.ts
import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import db from '@/drizzle';
import { supportMessages } from '@/drizzle/schema';

export async function POST(request: Request, context: { params: { id: string } }) {
  const { id } = await context.params;

  try {
    // Помечаем все сообщения в тикете как прочитанные
    await db.update(supportMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(supportMessages.ticketId, Number(id)),
          eq(supportMessages.isRead, false)
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