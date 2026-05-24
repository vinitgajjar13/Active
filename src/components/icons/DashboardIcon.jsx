import React from 'react';
import BaseIcon from './BaseIcon';

export default function DashboardIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.15" />
      <rect x="14" y="3" width="7" height="9" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="16" width="7" height="5" rx="1.5" fill="currentColor" fillOpacity="0.15" />
    </BaseIcon>
  );
}
