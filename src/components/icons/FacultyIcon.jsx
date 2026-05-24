import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserGroupIcon } from '@hugeicons/core-free-icons';

export default function FacultyIcon(props) {
  return (
    <HugeiconsIcon
      icon={UserGroupIcon}
      className={props.className}
      {...props}
    />
  );
}
