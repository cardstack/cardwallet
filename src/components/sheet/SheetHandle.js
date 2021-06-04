import React from 'react';
import { Container } from '@cardstack/components';

export const HandleHeight = 5;

export default function SheetHandle({ ...props }) {
  return (
    <Container
      backgroundColor={props.backgroundColor || 'backgroundBlue'}
      blurAmount={20}
      blurType="light"
      borderRadius={3}
      height={5}
      opacity={0.3}
      overflow="hidden"
      showBlur
      width={36}
      zIndex={9}
      {...props}
    />
  );
}
