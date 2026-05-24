import React from 'react';
import BaseIcon from './BaseIcon';

export default function ReportsIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M4 16H20" />
      <path d="M8 16V11" />
      <path d="M12 16V8" />
      <path d="M16 16V10" />
    </BaseIcon>
  );
}
