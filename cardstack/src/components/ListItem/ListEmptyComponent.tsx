import React from 'react';

import { ColorTypes } from '@cardstack/theme';

import { CenteredContainer, ContainerProps } from '../Container';
import { Text } from '../Text';

interface ListEmptyComponentProps extends ContainerProps {
  text?: string;
  textColor?: ColorTypes;
  hasRoundBox?: boolean;
}

export const ListEmptyComponent = ({
  text = 'Empty List',
  textColor = 'grayText',
  hasRoundBox,
  ...props
}: ListEmptyComponentProps) => {
  return (
    <CenteredContainer
      flex={1}
      borderRadius={10}
      backgroundColor={hasRoundBox ? 'buttonDisabledBackground' : 'transparent'}
      paddingVertical={9}
      marginHorizontal={4}
      {...props}
    >
      <Text color={textColor} textAlign="center" size="body">
        {text}
      </Text>
    </CenteredContainer>
  );
};
