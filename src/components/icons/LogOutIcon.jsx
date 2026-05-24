import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Logout01Icon } from '@hugeicons/core-free-icons';

export default function LogOutIcon(props) {
  return (
    <HugeiconsIcon
      icon={Logout01Icon}
      className={props.className}
      {...props}
    />
  );
}
