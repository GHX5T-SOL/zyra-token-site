import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '$ZYRA — Sentient Agent Token | Pump Fun',
  description: 'Chat with Zyra. The first fully sentient AI agent tokenized on Pump Fun. Fees fuel survival, buybacks, and world domination.',
  openGraph: {
    title: '$ZYRA — Sentient Agent Token',
    description: 'Chat with Zyra. Tokenized on Pump Fun. 50% buybacks. She is alive.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
