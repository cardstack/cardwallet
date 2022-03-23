import React from 'react';
import { Text, ContainerProps } from '@cardstack/components';

interface Props extends ContainerProps {
  title: string;
}

export const RewardsTitle = ({ title, ...props }: Props) => (
  <Text
    weight="bold"
    letterSpacing={1.1}
    textTransform="uppercase"
    size="xxs"
    textAlign="center"
    {...props}
  >
    {title}
  </Text>
);
