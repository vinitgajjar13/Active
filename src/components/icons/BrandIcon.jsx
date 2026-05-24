import React from 'react';

export default function BrandIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="52" height="52" rx="16" fill="url(#brandGrad)" />
      <rect x="2" y="2" width="52" height="52" rx="16" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      <path d="M12 24L28 16L44 24L28 32L12 24Z" fill="white" />
      <path d="M18 28V34.5C18 37 22.5 39 28 39C33.5 39 38 37 38 34.5V28" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44 24V31.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="44" cy="33.5" r="2.2" fill="#52C878" />
      <defs>
        <linearGradient id="brandGrad" x1="2" y1="2" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
