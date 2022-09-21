import React, { memo } from 'react';

import {
  Container,
  ContainerProps,
  Text,
  CardPressable,
} from '@cardstack/components';

interface Props {
  text: string;
  disabled: boolean;
  onPress: () => void;
}

export const WordPressable = memo(
  ({ text, disabled, onPress, ...rest }: Props & ContainerProps) => (
    <CardPressable onPress={onPress} disabled={disabled}>
      <Container
        borderWidth={1}
        borderColor="secondaryText"
        borderRadius={10}
        {...rest}
      >
        <Text
          padding={2}
          variant="semibold"
          color={disabled ? 'secondaryText' : 'teal'}
          size="body"
        >
          {text}
        </Text>
      </Container>
    </CardPressable>
  )
);
