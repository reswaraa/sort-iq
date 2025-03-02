import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from './_components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sort-IQ',
  description: 'AI-powered waste classification and management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>{' '}
      </body>
    </html>
  );
}
