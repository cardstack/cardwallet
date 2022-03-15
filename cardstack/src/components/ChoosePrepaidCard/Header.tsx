import React, { memo } from 'react';
import {
  Container,
  HorizontalDivider,
  Touchable,
  Text,
} from '@cardstack/components';
import { hitSlop } from '@cardstack/utils/layouts';

export const Header = memo(
  ({
    nativeBalanceDisplay,
    onPressEditAmount,
  }: {
    nativeBalanceDisplay: string;
    onPressEditAmount: () => void;
  }) => (
    <Container
      alignItems="center"
      backgroundColor="white"
      width="100%"
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
    >
      <Text marginTop={4} weight="bold" size="body">
        Choose a Prepaid Card
      </Text>
      <Text variant="subText" weight="bold" marginTop={3} marginBottom={1}>
        To Pay This Amount
      </Text>
      <Container width="100%" alignItems="center">
        <Touchable onPress={onPressEditAmount}>
          <Text weight="bold" size="body">
            {nativeBalanceDisplay}
          </Text>
        </Touchable>
        <Touchable
          position="absolute"
          right={20}
          paddingTop={1}
          onPress={onPressEditAmount}
          hitSlop={hitSlop.small}
        >
          <Text size="xxs">Edit Amount</Text>
        </Touchable>
      </Container>
      <HorizontalDivider height={2} marginVertical={0} marginTop={1} />
    </Container>
  )
);
