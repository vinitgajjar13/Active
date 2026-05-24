import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CalendarCheckIn01Icon } from '@hugeicons/core-free-icons';

export default function AttendanceIcon(props) {
  return (
    <HugeiconsIcon
      icon={CalendarCheckIn01Icon}
      className={props.className}
      {...props}
    />
  );
}
