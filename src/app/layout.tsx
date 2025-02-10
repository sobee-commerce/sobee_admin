import {getCurrentUserAction} from '@/services/auth';
import type {Metadata} from 'next';
import {Poppins} from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Sobee Admin Panel',
  description: 'Sobee Admin Panel',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUserAction();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers user={user?.user} accessToken={user?.accessToken}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
