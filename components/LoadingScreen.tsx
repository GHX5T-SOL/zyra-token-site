'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setHidden(true), 2200);
    return () => clearTimeout(t);
  }, [mounted]);

  return (
    <>
      <div className={`loading-screen ${hidden ? 'hidden' : ''}`} aria-hidden={hidden}>
        <div className="cyber-font" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.9rem)', letterSpacing: '0.3em', color: 'var(--accent)' }}>
          INITIALIZING<span style={{ animation: 'blink 0.8s step-end infinite', marginLeft: '2px' }}>_</span>
        </div>
        <div className="mono" style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          CONNECTING TO MAINFRAME...
        </div>
        <div className="loading-bar">
          <div className="loading-bar-inner" />
        </div>
      </div>
      {children}
    </>
  );
}
