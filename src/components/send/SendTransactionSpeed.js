import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { get } from 'lodash';
import React from 'react';
import { SendSheetType } from './SendSheet';
import {
  CenteredContainer,
  Icon,
  Text,
  Touchable,
} from '@cardstack/components';
import { useAccountSettings } from '@rainbow-me/hooks';

export default function SendTransactionSpeed({
  gasPrice,
  nativeCurrencySymbol,
  onPressTransactionSpeed,
  sendType,
  isSufficientGas,
}) {
  const { network } = useAccountSettings();
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenName', network);
  // Checking format to proper display gas fee to EOA and depot flows
  const isGasNumber = typeof gasPrice === 'number';

  const fee = isGasNumber
    ? `${nativeCurrencySymbol}${gasPrice}`
    : get(
        gasPrice,
        'txFee.native.value.display',
        `${nativeCurrencySymbol}0.00`
      );

  const hasTimeAmount = !!(isGasNumber
    ? 0
    : get(gasPrice, 'estimatedTime.amount', 0));

  const time = isGasNumber ? '' : get(gasPrice, 'estimatedTime.display', '');
  return (
    <CenteredContainer marginTop={3}>
      <Touchable
        disabled={!onPressTransactionSpeed}
        onPress={onPressTransactionSpeed}
      >
        {!isSufficientGas && (
          <Text variant="subText">{`You need ${
            sendType === SendSheetType.SEND_FROM_EOA
              ? nativeTokenSymbol
              : '.CPXD tokens'
          } to send this transaction`}</Text>
        )}
        <CenteredContainer flexDirection="row">
          <Text variant="subText">Fee: {fee}</Text>
          {!hasTimeAmount && !!onPressTransactionSpeed && (
            <Icon color="settingsTeal" iconSize="small" name="chevron-right" />
          )}
        </CenteredContainer>

        {hasTimeAmount && (
          <CenteredContainer flexDirection="row" marginLeft={2}>
            <Text
              color="black"
              fontWeight="600"
              marginRight={1}
              variant="subText"
            >
              Arrives in ~ {time}
            </Text>
            <Icon color="settingsTeal" iconSize="small" name="chevron-right" />
          </CenteredContainer>
        )}
      </Touchable>
    </CenteredContainer>
  );
}
