import {
  convertAmountToBalanceDisplay,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import {
  CenteredContainer,
  Icon,
  Text,
  Touchable,
} from '@cardstack/components';
import { useAccountSettings } from '@rainbow-me/hooks';

export const SendSheetType = {
  SEND_FROM_EOA: 'SEND_FROM_EOA',
  SEND_FROM_DEPOT: 'SEND_FROM_DEPOT',
};

export default function SendTransactionSpeed({
  gasPrice,
  nativeCurrencySymbol,
  onPressTransactionSpeed,
  sendType,
  isSufficientGas,
}) {
  const { network } = useAccountSettings();
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);
  const isDepot = sendType === SendSheetType.SEND_FROM_DEPOT;
  const feeDescription = useMemo(() => {
    if (isDepot) {
      return `${get(
        gasPrice,
        'nativeDisplay',
        0
      )} ≈ ${nativeCurrencySymbol}${get(gasPrice, 'amount', 0)}`;
    } else {
      const nativeValueDisplay = convertAmountToBalanceDisplay(
        get(gasPrice, 'txFee.native.value.amount', 0),
        {
          decimals: 6,
          symbol: nativeTokenSymbol,
        }
      );
      return `${nativeValueDisplay} ≈ ${get(
        gasPrice,
        'txFee.native.value.display',
        `${nativeCurrencySymbol}0.00`
      )}`;
    }
  }, [gasPrice, isDepot, nativeCurrencySymbol, nativeTokenSymbol]);

  const hasTimeAmount = useMemo(
    () => !!(isDepot ? 0 : get(gasPrice, 'estimatedTime.amount', 0)),
    [gasPrice, isDepot]
  );

  const time = useMemo(
    () => (isDepot ? '' : get(gasPrice, 'estimatedTime.display', '')),
    [gasPrice, isDepot]
  );

  return (
    <CenteredContainer marginTop={3}>
      <Touchable
        disabled={!onPressTransactionSpeed}
        onPress={onPressTransactionSpeed}
      >
        {!isSufficientGas && (
          <Text variant="subText">{`You need ${
            isDepot ? '.CPXD tokens' : nativeTokenSymbol
          } to send this transaction`}</Text>
        )}
        <CenteredContainer flexDirection="row">
          <Text variant="subText">{`Fee: ${feeDescription}`}</Text>
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
