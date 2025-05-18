// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/auth';
import db from '@/drizzle';
import { usersTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      );
    }

    await generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      avatar: user.avatar || undefined,
      phone: user.phone || undefined,
    });

    return NextResponse.json(
      { 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name,
          roleId: user.roleId
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}