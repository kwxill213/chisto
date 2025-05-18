// app/api/user/update/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { usersTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { getAuth, generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const auth = await getAuth(req);
    
    if (!auth || !auth.userId) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const { name, phone, avatar } = await req.json();

    // Базовая валидация
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Имя должно содержать минимум 2 символа' },
        { status: 400 }
      );
    }

    if (phone && typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Некорректный формат телефона' },
        { status: 400 }
      );
    }

    // Обновляем данные пользователя
    await db.update(usersTable)
      .set({
        name: name.trim(),
        phone: phone?.trim() || null,
        avatar: avatar || null,
      })
      .where(eq(usersTable.id, auth.userId));

    // Получаем обновленного пользователя
    const updatedUser = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        phone: usersTable.phone,
        avatar: usersTable.avatar,
        roleId: usersTable.roleId,
      })
      .from(usersTable)
      .where(eq(usersTable.id, auth.userId))
      .then(users => users[0]);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    await generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      roleId: updatedUser.roleId,
      avatar: updatedUser.avatar ?? undefined,
      phone: updatedUser.phone ?? undefined,
    });

    return NextResponse.json(
      { 
        user: updatedUser,
        message: 'Профиль успешно обновлен' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при обновлении профиля' },
      { status: 500 }
    );
  }
}