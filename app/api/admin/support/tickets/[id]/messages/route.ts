// app/api/admin/support/tickets/[id]/messages/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { supportMessages } from '@/drizzle/schema';


export async function POST(request: Request, context: { params: { id: string } }) {
  try {
  const { id } = await context.params;
    const { message, senderId } = await request.json();

    if (!message || !senderId) {
      return NextResponse.json({ error: 'Message and senderId required' }, { status: 400 });
    }

    const [newMessage] = await db.insert(supportMessages).values({
      ticketId: Number(id),
      senderId: Number(senderId),
      message,
      isRead: false,
      createdAt: new Date(),
    }).$returningId();

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}