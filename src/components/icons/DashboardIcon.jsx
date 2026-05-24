import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { DashboardSquare01Icon } from '@hugeicons/core-free-icons';

export default function DashboardIcon(props) {
  return (
    <HugeiconsIcon
      icon={DashboardSquare01Icon}
      className={props.className}
      {...props}
    />
  );
}
