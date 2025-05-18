// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { notifications } from '@/drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const auth = await getAuth(request);
    const userId = auth?.userId;

    if (!userId) {
      return NextResponse.json([], { status: 200 }); // Возвращаем пустой массив вместо 401
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, Number(userId)))
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    return NextResponse.json(userNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json([], { status: 200 }); // Возвращаем пустой массив при ошибке
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, title, message, typeId, relatedId } = body;

    if (!userId || !title || !message) {
      return NextResponse.json({ error: 'userId, title, and message are required' }, { status: 400 });
    }

    const notificationData: any = {
      userId: Number(userId),
      title,
      message,
      isRead: false,
      createdAt: new Date(),
    };
    if (typeId !== undefined) {
      notificationData.typeId = Number(typeId);
    }
    if (relatedId !== undefined) {
      notificationData.relatedId = Number(relatedId);
    }

    const [newNotification] = await db.insert(notifications).values(notificationData).$returningId();

    return NextResponse.json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}