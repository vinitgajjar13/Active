import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ChevronDown } from '@hugeicons/core-free-icons';

export default function ChevronDownIcon(props) {
  return (
    <HugeiconsIcon
      icon={ChevronDown}
      className={props.className}
      {...props}
    />
  );
}
