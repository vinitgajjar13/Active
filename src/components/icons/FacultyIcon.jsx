import React from 'react';
import BaseIcon from './BaseIcon';

export default function FacultyIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="17" cy="7.5" r="3" fill="currentColor" fillOpacity="0.15" />
      <path d="M13 19.5C13.5 17 15 15.5 17.5 15.5C20 15.5 21.5 17 22 19.5" />
      <circle cx="9" cy="8.5" r="4" fill="currentColor" fillOpacity="0.15" />
      <path d="M2 19.5C2 15.5 5 13.5 9 13.5C13 13.5 16 15.5 16 19.5" />
    </BaseIcon>
  );
}
