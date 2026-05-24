import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { WhatsappIcon } from '@hugeicons/core-free-icons';

export default function WhatsAppIcon(props) {
  return (
    <HugeiconsIcon
      icon={WhatsappIcon}
      className={props.className}
      {...props}
    />
  );
}
