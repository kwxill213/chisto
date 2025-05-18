// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/auth';
import db from '@/drizzle';
import { usersTable, userRoles } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { email, password, name, phone } = await req.json();

    // Базовая валидация
    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Некорректный email' },
        { status: 400 }
      );
    }

    // Проверка пароля
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 8 символов' },
        { status: 400 }
      );
    }

    // Проверка существующего пользователя
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Получаем ID роли клиента (предполагаем, что роль client имеет id = 1)
    const [clientRole] = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.name, 'client'));

    if (!clientRole) {
      return NextResponse.json(
        { error: 'Ошибка системы: роль клиента не найдена' },
        { status: 500 }
      );
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const insertResult = await db.insert(usersTable).values({
      email,
      password: hashedPassword,
      name,
      phone,
      roleId: clientRole.id, // Устанавливаем роль клиента
      isVerified: false,
    });

    // Получаем только что созданного пользователя по email
    const [newUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    // Генерация токена и установка cookie
    await generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      roleId: newUser.roleId,
      phone: newUser.phone ?? undefined,
    });

    return NextResponse.json(
      { 
        user: { 
          id: newUser.id, 
          email: newUser.email, 
          name: newUser.name,
          roleId: newUser.roleId 
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}