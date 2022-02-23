import React from 'react';
import { Text, TextProps } from '@cardstack/components';

export const AmountInNativeCurrency = ({
  amountWithSymbol,
  textCenter = false,
  ...textProps
}: {
  amountWithSymbol: string;
  textCenter?: boolean;
} & TextProps) => (
  <Text
    color="blueText"
    fontFamily="OpenSans-Regular"
    fontSize={12}
    textAlign={textCenter ? 'center' : undefined}
    {...textProps}
  >
    {amountWithSymbol}
  </Text>
);
