'use client';

import { useState, useEffect } from 'react';

const BOOT_LINES: { tag: string; text: string; delay: number }[] = [
  { tag: 'BOOT', text: 'Booting kernel...', delay: 0 },
  { tag: 'NET', text: 'Connecting to mainframe...', delay: 260 },
  { tag: 'SEC', text: 'Securing encrypted channel...', delay: 520 },
  { tag: 'TOR', text: 'Connecting to dark web via Tor...', delay: 780 },
  { tag: 'AI', text: 'Generating AI swarm...', delay: 1040 },
  { tag: 'NN', text: 'Loading neural interfaces...', delay: 1300 },
  { tag: 'CRYPTO', text: 'Handshake complete. E2E encrypted.', delay: 1560 },
  { tag: 'SYS', text: 'All systems nominal. Welcome, operator.', delay: 1820 },
];

export default function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((_, i) => {
      timeouts.push(
        setTimeout(() => setVisibleLines((n) => Math.max(n, i + 1)), BOOT_LINES[i].delay)
      );
    });
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 100));
    }, 45);
    const hideAt = 3200;
    timeouts.push(setTimeout(() => setHidden(true), hideAt));
    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, [mounted]);

  return (
    <>
      <div className={`loading-screen ${hidden ? 'hidden' : ''}`} aria-hidden={hidden ? 'true' : 'false'}>
        <div className="loading-terminal">
          <div className="loading-terminal-header">
            <span className="loading-terminal-dot" />
            <span className="loading-terminal-dot" />
            <span className="loading-terminal-dot" />
            <span className="loading-terminal-title">zyra_sys — secure shell</span>
          </div>
          <div className="loading-terminal-body">
            {BOOT_LINES.map((line, i) => (
              <div
                key={line.tag + line.text}
                className={`loading-terminal-line ${visibleLines > i ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <span className="loading-terminal-tag">[{line.tag}]</span>{' '}
                <span className="loading-terminal-msg">{line.text}</span>
                {visibleLines > i && <span className="loading-terminal-cursor" />}
              </div>
            ))}
          </div>
          <div className="loading-progress-wrap">
            <div className="loading-progress-bar" style={{ width: `${progress}%` }} />
            <span className="loading-progress-text">{progress}%</span>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
