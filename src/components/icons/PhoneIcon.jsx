import React from 'react';
import BaseIcon from './BaseIcon';

export default function PhoneIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="6" y="3" width="12" height="18" rx="2.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M10 6H14" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}
