// app/admin/layout.tsx
import { Inter } from 'next/font/google';
import { AdminNavbar } from './components/Navbar';
import { AdminSidebar } from './components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}