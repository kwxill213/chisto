// app/api/admin/employee-performance/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { 
  usersTable,
  orders,
  employeeProfiles
} from '@/drizzle/schema';
import { and, eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const employees = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        completedOrders: employeeProfiles.completedOrders,
        hireDate: employeeProfiles.hireDate,
      })
      .from(usersTable)
      .innerJoin(employeeProfiles, eq(usersTable.id, employeeProfiles.userId))
      .where(eq(usersTable.roleId, 2));

    const employeeStats = await Promise.all(
      employees.map(async (employee) => {

        const revenue = await db
          .select({ total: sql<number>`sum(${orders.totalPrice})` })
          .from(orders)
          .where(
            and(
              eq(orders.employeeId, employee.id),
              eq(orders.paymentStatusId, 2)
            )
          );

        return {
          ...employee,
          totalRevenue: revenue[0].total || 0,
        };
      })
    );

    return NextResponse.json(
      employeeStats
        .sort(
          (a, b) =>
            (Number(b.completedOrders) || 0) - (Number(a.completedOrders) || 0)
        )
        .slice(0, 5)
    );
  } catch (error) {
    console.error('Employee performance fetch error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении данных сотрудников' },
      { status: 500 }
    );
  }
}