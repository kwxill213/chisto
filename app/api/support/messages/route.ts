// app/api/support/messages/route.ts
import db from '@/drizzle';
import { supportMessages } from '@/drizzle/schema';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { ticketId, message, senderId, senderEmail, senderName } = await request.json();

    const [supportMessage] = await db.insert(supportMessages).values({
      ticketId,
      senderId: senderId || null,
      message,
      isRead: false,
      createdAt: new Date()
    }).$returningId();

    // Здесь можно добавить отправку email уведомления
    // await sendSupportEmailNotification(senderEmail, senderName, message);

    return NextResponse.json(supportMessage);
  } catch (error) {
    console.error('Error creating support message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}