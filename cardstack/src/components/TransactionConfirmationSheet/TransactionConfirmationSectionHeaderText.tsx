import React from 'react';
import { Text, TextProps } from '../Text';

export const TransactionConfirmationSectionHeaderText = (props: TextProps) => (
  <Text size="xxs" weight="extraBold" color="blueText" {...props}>
    {props.children}
  </Text>
);
