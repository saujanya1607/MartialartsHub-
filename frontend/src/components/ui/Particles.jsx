import { useEffect, useRef } from 'react';

export default function Particles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];
    const count = window.innerWidth < 768 ? 12 : 25;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'particle';
      const size = Math.random() * 4 + 2;
      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}vw;
        animation-duration: ${Math.random() * 10 + 8}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: ${Math.random() * 0.6 + 0.2};
      `;
      container.appendChild(el);
      particles.push(el);
    }

    return () => particles.forEach(p => p.remove());
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
      aria-hidden="true"
    />
  );
}
