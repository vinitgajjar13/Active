import React from 'react';
import BaseIcon from './BaseIcon';

export default function ClockIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" />
      <polyline points="12 6 12 12 16 14" />
    </BaseIcon>
  );
}
