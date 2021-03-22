import { get } from 'lodash';
import React from 'react';

import { Row } from '../layout';
import { Container, Icon, Text, Touchable } from '@cardstack/components';

export default function SendTransactionSpeed({
  gasPrice,
  nativeCurrencySymbol,
  onPressTransactionSpeed,
}) {
  const fee = get(
    gasPrice,
    'txFee.native.value.display',
    `${nativeCurrencySymbol}0.00`
  );
  const time = get(gasPrice, 'estimatedTime.display', '');

  return (
    <Row justify="center">
      <Touchable marginRight={5} onPress={onPressTransactionSpeed}>
        <Text variant="subText">Fee: {fee}</Text>
      </Touchable>
      <Touchable onPress={onPressTransactionSpeed}>
        <Container alignItems="center" flexDirection="row">
          <Text
            color="black"
            fontWeight="600"
            marginRight={1}
            variant="subText"
          >
            Arrives in ~ {time}
          </Text>
          <Icon color="settingsGray" iconSize="small" name="chevron-right" />
        </Container>
      </Touchable>
    </Row>
  );
}
