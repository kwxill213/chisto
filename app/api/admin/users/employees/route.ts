import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/drizzle';
import { usersTable, userRoles } from '@/drizzle/schema';

export async function GET() {
  try {
    const employees = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
      })
      .from(usersTable)
      .innerJoin(userRoles, eq(usersTable.roleId, userRoles.id))
      .where(eq(userRoles.name, 'employee'));

    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}