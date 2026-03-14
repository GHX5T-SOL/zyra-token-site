'use client';

import { useEffect, useRef } from 'react';

// Matrix-style characters: CJK + katakana/hiragana + digits/symbols
const CHARS =
  'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF' +
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  '中文网码数制据控系级联处理';

function getChars(): string[] {
  return CHARS.split('');
}

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const c = canvas;
    const chars = getChars();
    const fontSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 12 : 14;
    let columns: number;
    let width: number;
    let height: number;
    let drops: number[];

    function resize() {
      width = c.width = window.innerWidth;
      height = c.height = window.innerHeight;
      columns = Math.max(8, Math.floor(width / fontSize));
      drops = Array.from({ length: columns }, () => Math.random() * -20);
    }

    function draw() {
      if (!c || !ctx) return;
      ctx.fillStyle = 'rgba(5, 5, 8, 0.06)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = 'rgba(0, 255, 170, 0.15)';
        ctx.fillText(char, x, y);

        if (Math.random() > 0.975) {
          ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
          ctx.fillText(char, x, y);
        }

        if (y > height && Math.random() > 0.96) {
          drops[i] = 0;
        } else {
          drops[i] += 0.8 + Math.random() * 0.4;
        }
      }
    }

    resize();
    window.addEventListener('resize', resize);

    let raf: number;
    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas"
      aria-hidden="true"
    />
  );
}
