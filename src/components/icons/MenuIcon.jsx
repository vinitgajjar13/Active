import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon } from '@hugeicons/core-free-icons';

export default function MenuIcon(props) {
  return (
    <HugeiconsIcon
      icon={Menu01Icon}
      className={props.className}
      {...props}
    />
  );
}
