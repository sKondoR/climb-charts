import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Climb Charts - 3D Visualization',
  description: 'Interactive 3D charts for climbing route data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
