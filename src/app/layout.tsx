import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserProvider } from '@/context/UserContext';

export const metadata: Metadata = {
  title: 'Uttarakhand Rugby Association | Official State Rugby Association | Devbhoomi Sports',
  description: 'Official governing sports organization for Rugby Union and Rugby Sevens in Uttarakhand, India. Developing players, clubs, tournaments, and grassroots rugby across Garhwal and Kumaon.',
  keywords: [
    'Uttarakhand Rugby Association',
    'Rugby Uttarakhand',
    'Rugby in Uttarakhand',
    'Uttarakhand Rugby',
    'Rugby clubs Uttarakhand',
    'Rugby tournaments Uttarakhand',
    'Himalayan Rugby',
    'Rugby India IRFU Uttarakhand'
  ],
  authors: [{ name: 'Uttarakhand Rugby Association Technical Unit' }],
  openGraph: {
    title: 'Uttarakhand Rugby Association | Official State Rugby Association',
    description: 'Building the future of rugby in the Himalayas. Discover state teams, tournaments, player registrations, and district development.',
    url: 'https://rugbyuttarakhand.org',
    siteName: 'Uttarakhand Rugby Association',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-[#17211D] flex flex-col selection:bg-[#008F65] selection:text-white">
        <UserProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
