import React, { useEffect, useState } from 'react';

/**
 * Custom Sacred Golden Cursor
 * Features a glowing golden ring with a celestial center point
 * and trailing particle response. Automatically hides on touch devices.
 */
export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable element
      const target = e.target;
      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.onclick != null ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button';

      setIsPointer(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth trail lerp
  useEffect(() => {
    if (isTouch) return;
    let animId;
    const animateTrail = () => {
      setTrail((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.25,
        y: prev.y + (pos.y - prev.y) * 0.25,
      }));
      animId = requestAnimationFrame(animateTrail);
    };
    animId = requestAnimationFrame(animateTrail);
    return () => cancelAnimationFrame(animId);
  }, [pos, isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* Outer Halo */}
      <div
        className="fixed pointer-events-none z-[9999] transition-transform duration-75 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          width: isPointer ? '48px' : '32px',
          height: isPointer ? '48px' : '32px',
          borderRadius: '50%',
          border: '1.5px solid rgba(212, 175, 55, 0.6)',
          boxShadow: isPointer
            ? '0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.3)'
            : '0 0 12px rgba(212, 175, 55, 0.3)',
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease',
        }}
      />
      {/* Inner Golden Dot */}
      <div
        className="fixed pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#FFD700',
          boxShadow: '0 0 8px #FFD700',
        }}
      />
    </>
  );
}
