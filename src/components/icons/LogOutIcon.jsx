import React from 'react';
import BaseIcon from './BaseIcon';

export default function LogOutIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M9 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h4" fill="currentColor" fillOpacity="0.15" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </BaseIcon>
  );
}
