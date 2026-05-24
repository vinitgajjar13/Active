import React from 'react';
import BaseIcon from './BaseIcon';

export default function MenuIcon(props) {
  return (
    <BaseIcon {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="18" x2="18" y2="18" />
    </BaseIcon>
  );
}
