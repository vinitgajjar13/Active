import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

export default function CloseIcon(props) {
  return (
    <HugeiconsIcon
      icon={Cancel01Icon}
      className={props.className}
      {...props}
    />
  );
}
