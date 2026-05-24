import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SmartPhone01Icon } from '@hugeicons/core-free-icons';

export default function PhoneIcon(props) {
  return (
    <HugeiconsIcon
      icon={SmartPhone01Icon}
      className={props.className}
      {...props}
    />
  );
}
