import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareerLens AI — AI Opportunity Intelligence Platform',
  description: 'AI that understands your skills, goals, potential, and gaps — connecting students with opportunities that actually fit.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-[#F7F9FC] text-[#172033] antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
