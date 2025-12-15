import { useEffect, useRef } from 'react';

export function RainEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createRaindrop = () => {
      const drop = document.createElement('div');
      drop.className = 'raindrop';
      drop.style.cssText = `
        position: absolute;
        width: 1px;
        height: ${15 + Math.random() * 20}px;
        background: linear-gradient(to bottom, transparent, hsl(38 50% 50% / 0.3));
        left: ${Math.random() * 100}%;
        top: -20px;
        animation: rainFall ${0.5 + Math.random() * 0.5}s linear forwards;
        pointer-events: none;
      `;
      container.appendChild(drop);

      setTimeout(() => drop.remove(), 1000);
    };

    const interval = setInterval(createRaindrop, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes rainFall {
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none overflow-hidden z-10"
        aria-hidden="true"
      />
    </>
  );
}
