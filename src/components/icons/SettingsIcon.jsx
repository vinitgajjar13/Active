import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Settings01Icon } from '@hugeicons/core-free-icons';

export default function SettingsIcon(props) {
  return (
    <HugeiconsIcon
      icon={Settings01Icon}
      className={props.className}
      {...props}
    />
  );
}
