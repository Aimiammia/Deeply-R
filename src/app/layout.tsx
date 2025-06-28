
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Vazirmatn } from 'next/font/google';
import { ThemeManager } from '@/components/ThemeManager';

const vazirmatnFont = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Deeply',
  description: 'Organize your tasks and reflect deeply.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatnFont.variable} dark`}>
      <head>
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background bg-gradient-to-br from-background via-background/95 to-primary/10">
        <ThemeManager />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
