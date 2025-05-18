// app/api/notifications/read-all/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { notifications } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

export async function PUT(request: Request) {
  const auth = await getAuth(request);
  const userId = auth?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.userId, Number(userId)),
          eq(notifications.isRead, false)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}