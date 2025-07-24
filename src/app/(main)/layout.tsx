
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
