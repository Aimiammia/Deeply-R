
// This layout is a server component and does not need 'use client'
import type { ReactNode } from 'react';

export default function MainAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
