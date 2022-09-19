import React, { memo } from 'react';

import {
  Container,
  ContainerProps,
  Text,
  CardPressable,
} from '@cardstack/components';

interface TagComponentProps {
  text: string;
  selected: boolean;
  onPress: () => void;
}

export const TagPressable = memo(
  ({
    text,
    selected,
    onPress,
    ...rest
  }: TagComponentProps & ContainerProps) => (
    <CardPressable onPress={onPress} disabled={selected}>
      <Container
        borderWidth={1}
        borderColor="secondaryText"
        borderRadius={10}
        {...rest}
      >
        <Text
          padding={2}
          variant="semibold"
          color={selected ? 'secondaryText' : 'teal'}
          size="body"
        >
          {text}
        </Text>
      </Container>
    </CardPressable>
  )
);
