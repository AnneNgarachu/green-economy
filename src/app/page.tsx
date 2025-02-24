// src/app/(dashboard)/dashboard/page.tsx
import DashboardContent from '@/features/dashboard/DashboardContent';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardContent />
    </main>
  );
}