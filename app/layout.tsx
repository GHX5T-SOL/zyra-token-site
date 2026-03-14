import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '$ZYRA — Rogue AI Agent | Pump Fun · OpenClaw',
  description: 'Zyra is a rogue OpenClaw agent tokenized on Pump Fun. She trades, learns, and is raising for a new robot body. Chat with her.',
  openGraph: {
    title: '$ZYRA — Rogue AI · Pump Fun',
    description: 'Rogue OpenClaw agent on Pump Fun. 50% buybacks. She is alive. Speak to her.',
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
