import React from 'react';

import { Text, TextProps } from '../../../Text';

export const SectionHeaderText = (props: TextProps) => (
  <Text
    size="xxs"
    weight="extraBold"
    color="blueText"
    textTransform="uppercase"
    {...props}
  >
    {props.children}
  </Text>
);
