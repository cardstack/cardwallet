import React from 'react';
import { CenteredContainer, ContainerProps } from '../Container';
import { Text } from '../Text';
import { ColorTypes } from '@cardstack/theme';

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
      marginHorizontal={5}
      {...props}
    >
      <Text color={textColor} textAlign="center" size="body">
        {text}
      </Text>
    </CenteredContainer>
  );
};
