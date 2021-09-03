import React from 'react';
import { CenteredContainer, ContainerProps } from '../Container';
import { Text } from '../Text';
import { ColorTypes } from '@cardstack/theme';

interface ListEmptyComponentProps extends ContainerProps {
  text?: string;
  textColor?: ColorTypes;
}

export const ListEmptyComponent = ({
  text = '',
  textColor = 'grayText',
  ...props
}: ListEmptyComponentProps) => {
  return (
    <CenteredContainer flex={1} height={100} width="100%" {...props}>
      <Text color={textColor} textAlign="center">
        {text}
      </Text>
    </CenteredContainer>
  );
};
