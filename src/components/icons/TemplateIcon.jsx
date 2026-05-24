import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileUploadIcon } from '@hugeicons/core-free-icons';

export default function TemplateIcon(props) {
  return (
    <HugeiconsIcon
      icon={FileUploadIcon}
      className={props.className}
      {...props}
    />
  );
}
