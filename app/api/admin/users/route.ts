import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { usersTable, userRoles } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

// Получить всех пользователей
export async function GET() {
  try {
    const usersTableArr = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: userRoles.name,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .leftJoin(userRoles, eq(usersTable.roleId, userRoles.id));
    return NextResponse.json(usersTableArr);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// Добавить пользователя
export async function POST(req: Request) {
  try {
    const { name, email, password, roleId } = await req.json();
    if (!name || !email || !password || !roleId) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }
    // Здесь должен быть хеш пароля!
    const [user] = await db
      .insert(usersTable)
      .values({ name, email, password, roleId })
      .$returningId();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// Редактировать пользователя
export async function PATCH(req: Request) {
  try {
    const { id, name, email, roleId } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Не передан id пользователя' }, { status: 400 });
    }
    await db
      .update(usersTable)
      .set({ name, email, roleId })
      .where(eq(usersTable.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// Удалить пользователя
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Нет id' }, { status: 400 });
    await db.delete(usersTable).where(eq(usersTable.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}