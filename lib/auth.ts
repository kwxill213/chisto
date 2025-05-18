// lib/auth.ts
import { cookies, headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { TokenPayload } from './types';

const SECRET = process.env.JWT_SECRET!;

export const generateToken = async (user: { id: number; email: string; name: string; roleId: number; avatar?: string; phone?: string }) => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
    avatar: user.avatar || null,
    phone: user.phone || null,
  };
  
  const token = jwt.sign(payload, SECRET, { expiresIn: '10h' });
  (await cookies()).set('token', token);
  return token;
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, SECRET) as TokenPayload;
};

export const clearToken = async () => {
  (await cookies()).delete('token');
};

export async function getAuth(req: Request) {
  // 1. Пробуем из заголовка Authorization
  let token = req.headers.get('authorization')?.split(' ')[1] || 
              (await headers()).get('authorization')?.split(' ')[1];

  // 2. Если нет — пробуем из cookie
  if (!token) {
    // Для Next.js API Route (Edge): cookies().get('token')?.value
    // Для обычного fetch: req.headers.get('cookie')
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/token=([^;]+)/);
      if (match) token = match[1];
    }
    // Для Edge API Route (если вдруг): cookies().get('token')?.value
    if (!token) {
      token = (await cookies()).get('token')?.value || undefined;
    }
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      name: string;
      roleId: number;
      avatar?: string;
      phone?: string;
    };
    return { userId: decoded.id, user: decoded };
  } catch (err) {
    return null;
  }
}