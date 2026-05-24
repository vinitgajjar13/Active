import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon } from '@hugeicons/core-free-icons';

export default function CheckIcon(props) {
  return (
    <HugeiconsIcon
      icon={Tick01Icon}
      className={props.className}
      {...props}
    />
  );
}
