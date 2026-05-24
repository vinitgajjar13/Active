import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { InformationCircleIcon } from '@hugeicons/core-free-icons';

export default function InfoIcon(props) {
  return (
    <HugeiconsIcon
      icon={InformationCircleIcon}
      className={props.className}
      {...props}
    />
  );
}
