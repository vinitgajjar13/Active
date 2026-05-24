import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon } from '@hugeicons/core-free-icons';

export default function ClockIcon(props) {
  return (
    <HugeiconsIcon
      icon={Clock01Icon}
      className={props.className}
      {...props}
    />
  );
}
