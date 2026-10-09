import React, { useEffect, useState } from 'react';

export default function MouseFollower() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let animId;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.glass-card') ||
        target.closest('.interactive-target')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    // Smooth lerp trailing loop
    const loop = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      setTrailingPos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Ambient Iris Radial Glow under cursor */}
      <div
        className="pointer-events-none fixed z-40 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHovering ? '180px' : '90px',
          height: isHovering ? '180px' : '90px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Trailing Iris Precision Ring */}
      <div
        className="pointer-events-none fixed z-50 rounded-full border border-iris-500/40 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHovering ? '48px' : isClicking ? '26px' : '36px',
          height: isHovering ? '48px' : isClicking ? '26px' : '36px',
          borderColor: isHovering ? '#4F46E5' : 'rgba(99, 102, 241, 0.45)',
          backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.06)' : 'transparent',
          boxShadow: isHovering ? '0 0 16px rgba(79, 70, 229, 0.25)' : 'none',
        }}
      />

      {/* Primary Precision Dot */}
      <div
        className="pointer-events-none fixed z-50 w-2 h-2 rounded-full bg-iris-600 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.7 : isHovering ? 1.5 : 1})`,
        }}
      />
    </>
  );
}
