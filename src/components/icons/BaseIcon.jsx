import React from 'react';

export default function BaseIcon({ children, className = "", viewBox = "0 0 24 24", strokeWidth = "2" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox={viewBox}
    >
      {children}
    </svg>
  );
}
