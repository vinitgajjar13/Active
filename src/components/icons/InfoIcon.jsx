import React from 'react';
import BaseIcon from './BaseIcon';

export default function InfoIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}
