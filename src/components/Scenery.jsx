import React, { useEffect } from 'react';

export default function Scenery() {
  useEffect(() => {
    let ticking = false;

    const handlePointerMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const w = window.innerWidth || 1;
          const rawPx = (e.clientX / w) * 2 - 1;
          const clampedPx = Math.max(-1, Math.min(1, rawPx));
          document.documentElement.style.setProperty('--px', clampedPx.toFixed(3));
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleScroll = () => {
      const sy = window.scrollY || 0;
      document.documentElement.style.setProperty('--sy', `${sy.toFixed(1)}px`);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* שמש עגולה בפינה העליונה */}
      <div
        className="sun-circle absolute top-6 right-6 sm:top-10 sm:right-10 rounded-full"
        style={{
          width: '180px',
          height: '180px',
          backgroundColor: 'var(--sun)',
          opacity: 0.7,
          transform: 'scale(var(--breath, 1))',
          transition: 'transform 4s ease-in-out',
        }}
      />

      {/* שכבה רחוקה - 55vh */}
      <div
        className="scenery-layer absolute bottom-0 left-[-5%] w-[110%] transition-transform duration-300 ease-out"
        style={{
          height: '55vh',
          transform:
            'translate3d(calc(var(--px, 0) * 8px), calc(var(--sy, 0px) * -0.04), 0)',
        }}
      >
        <svg
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            fill="var(--far)"
            d="M0,280 C320,120 540,360 880,180 C1140,40 1320,220 1440,160 L1440,600 L0,600 Z"
          />
        </svg>
      </div>

      {/* שכבת אמצע - 40vh */}
      <div
        className="scenery-layer absolute bottom-0 left-[-5%] w-[110%] transition-transform duration-300 ease-out"
        style={{
          height: '40vh',
          transform:
            'translate3d(calc(var(--px, 0) * 18px), calc(var(--sy, 0px) * -0.08), 0)',
        }}
      >
        <svg
          viewBox="0 0 1440 450"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            fill="var(--mid)"
            d="M0,180 C260,280 560,90 840,210 C1080,310 1280,160 1440,220 L1440,450 L0,450 Z"
          />
        </svg>
      </div>

      {/* שכבה קרובה - 26vh */}
      <div
        className="scenery-layer absolute bottom-0 left-[-5%] w-[110%] transition-transform duration-300 ease-out"
        style={{
          height: '26vh',
          transform:
            'translate3d(calc(var(--px, 0) * 34px), calc(var(--sy, 0px) * -0.12), 0)',
        }}
      >
        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            fill="var(--near)"
            d="M0,120 C380,30 680,190 1020,90 C1240,20 1380,110 1440,80 L1440,300 L0,300 Z"
          />
        </svg>
      </div>
    </div>
  );
}
