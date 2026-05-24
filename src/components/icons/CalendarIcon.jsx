import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar01Icon } from '@hugeicons/core-free-icons';

export default function CalendarIcon(props) {
  return (
    <HugeiconsIcon
      icon={Calendar01Icon}
      className={props.className}
      {...props}
    />
  );
}
