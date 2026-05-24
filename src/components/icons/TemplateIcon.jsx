import React from 'react';
import BaseIcon from './BaseIcon';

export default function TemplateIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M12 12v6" />
      <polyline points="15 15 12 12 9 15" />
    </BaseIcon>
  );
}
