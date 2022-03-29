import React, { memo } from 'react';
import { strings } from './strings';
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
    payCostDesc,
  }: {
    nativeBalanceDisplay: string;
    onPressEditAmount?: () => void;
    payCostDesc?: string;
  }) => (
    <Container
      alignItems="center"
      backgroundColor="white"
      width="100%"
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
    >
      <Text marginTop={4} weight="bold" size="body">
        {strings.chooseAPrepadCard}
      </Text>
      <Text
        fontSize={11}
        fontWeight="600"
        color="blueText"
        marginTop={3}
        marginBottom={1}
      >
        {payCostDesc || strings.payAmountDesc}
      </Text>
      <Container width="100%" alignItems="center">
        <Touchable onPress={onPressEditAmount}>
          <Text weight="bold" size="body">
            {nativeBalanceDisplay}
          </Text>
        </Touchable>
        {onPressEditAmount ? (
          <Touchable
            position="absolute"
            right={20}
            paddingTop={1}
            onPress={onPressEditAmount}
            hitSlop={hitSlop.small}
          >
            <Text size="xxs">{strings.editAmount}</Text>
          </Touchable>
        ) : null}
      </Container>
      <HorizontalDivider height={2} marginVertical={0} marginTop={1} />
    </Container>
  )
);
