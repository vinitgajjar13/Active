import React from 'react';
import BaseIcon from './BaseIcon';

export default function CalendarIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" fill="currentColor" fillOpacity="0.15" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </BaseIcon>
  );
}
