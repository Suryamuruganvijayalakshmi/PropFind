import React from 'react';

export default function Logo({ size = 'md', light = false, showTagline = false }) {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-xl', badge: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', badge: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', badge: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', badge: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      {/* Emblem Icon */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
        {/* Soft Iris / Ivory Glow behind */}
        <div className="absolute inset-0 bg-iris-500/20 rounded-xl blur-[6px] group-hover:bg-iris-500/35 transition-all"></div>
        
        {/* Architectural Geometry SVG */}
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-sm"
        >
          {/* Base Iris Rounded Hexagon/Shield */}
          <rect
            x="2"
            y="2"
            width="40"
            height="40"
            rx="12"
            fill="url(#irisGrad)"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.5"
          />
          {/* Architectural Glass Tower Facets */}
          <path
            d="M22 8L10 16V34L22 40L34 34V16L22 8Z"
            fill="white"
            fillOpacity="0.12"
          />
          {/* Left Wing Facet (Swimming Pool Blue / Iris 300) */}
          <path
            d="M22 8L10 16V34L22 28V8Z"
            fill="url(#leftFacet)"
            fillOpacity="0.4"
          />
          {/* Right Clean Glass Facet */}
          <path
            d="M22 8L34 16V34L22 28V8Z"
            fill="url(#rightFacet)"
            fillOpacity="0.75"
          />
          {/* Iris Compass Diamond / Discovery Focal Point */}
          <path
            d="M22 17L27 23L22 29L17 23L22 17Z"
            fill="#FAFAF5"
            stroke="#4F46E5"
            strokeWidth="1.5"
          />
          <circle cx="22" cy="23" r="2.2" fill="#6366F1" />
          
          {/* Light Glint Reflection */}
          <path
            d="M13 18L21 12"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />

          <defs>
            <linearGradient id="irisGrad" x1="2" y1="2" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="0.6" stopColor="#4F46E5" />
              <stop offset="1" stopColor="#3730A3" />
            </linearGradient>
            <linearGradient id="leftFacet" x1="10" y1="16" x2="22" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A5B4FC" />
              <stop offset="1" stopColor="#818CF8" />
            </linearGradient>
            <linearGradient id="rightFacet" x1="34" y1="16" x2="22" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EEF2FF" />
              <stop offset="1" stopColor="#C7D2FE" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none font-display">
          <span className={`font-bold ${light ? 'text-white' : 'text-neutral-900'} ${currentSize.text} tracking-tight`}>
            Prop
          </span>
          <span className={`font-extrabold text-iris-600 ${currentSize.text} tracking-tight`}>
            Find
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-iris-500 ml-0.5 animate-pulse"></span>
        </div>
        {showTagline && (
          <span className={`font-medium tracking-wider uppercase text-[10px] ${light ? 'text-iris-200' : 'text-iris-600/70'} mt-0.5`}>
            Architectural Discovery
          </span>
        )}
      </div>
    </div>
  );
}
