// Root layout wraps entire app and provides Header and AuthProvider to all pages

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';

// Load Inter font from Google Fonts
const inter = Inter({ subsets: ['latin'] });

// Metadata for SEO and browser tab
export const metadata = {
  title: 'HanExpress - Express Yourself Naturally in Korean',
  description: 'Learn Korean expressions with context, pronunciation, and cultural nuances',
};

/**
 * Root Layout Component
 * Wraps all pages in the web app
 * @param props.children - The page content
 */

export default function RootLayout( {children} ) { 
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* User auth for entire app using Auth Provider */}
        <AuthProvider>
          {/* Header appears on every page */}
            <Header />
          
          {/* Main content (different for each page) */}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}