'use client';

import { DynamicDataTable } from './DynamicDataTable';
import { getTableDefinitions } from '@/lib/table-definitions';

export function DatabaseTables() {
  const tables = getTableDefinitions();

  return (
    <div className="space-y-8">
      {tables.map((table) => (
        <div
          key={table.value}
          className="border rounded-lg p-4 bg-white shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4">{table.label}</h2>
          <DynamicDataTable
            tableName={table.value}
            columns={table.columns}
            editable={table.editable}
          />
        </div>
      ))}
    </div>
  );
}