import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Notification01Icon } from '@hugeicons/core-free-icons';

export default function BellIcon(props) {
  return (
    <HugeiconsIcon
      icon={Notification01Icon}
      className={props.className}
      {...props}
    />
  );
}
