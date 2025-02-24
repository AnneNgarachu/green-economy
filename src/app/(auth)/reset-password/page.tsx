// app/(auth)/reset-password/page.tsx
import { PasswordResetForm } from '@/features/auth/components/PasswordResetForm';

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PasswordResetForm />
    </div>
  );
}