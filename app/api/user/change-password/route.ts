// app/api/user/change-password/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import db from '@/drizzle';
import { usersTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const auth = await getAuth(req);
    
    if (!auth || !auth.userId) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    // Валидация
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 8 символов' },
        { status: 400 }
      );
    }

    // Получаем текущего пользователя
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, auth.userId));

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверяем текущий пароль
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Текущий пароль неверен' },
        { status: 400 }
      );
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль
    await db.update(usersTable)
      .set({ password: hashedPassword })
      .where(eq(usersTable.id, auth.userId));

    return NextResponse.json(
      { message: 'Пароль успешно изменен' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при смене пароля' },
      { status: 500 }
    );
  }
}