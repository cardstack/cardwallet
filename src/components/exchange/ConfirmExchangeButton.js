import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import ExchangeModalTypes from '../../helpers/exchangeModalTypes';
import { HoldToAuthorizeButton } from '../buttons';
import { SlippageWarningThresholdInBips } from './SlippageWarning';
import { useAccountSettings } from '@rainbow-me/hooks';

const ConfirmExchangeButton = ({
  disabled,
  isAuthorizing,
  isSufficientBalance,
  isSufficientGas,
  isSufficientLiquidity,
  onSubmit,
  slippage,
  testID,
  type,
  ...props
}) => {
  const { colors } = useTheme();
  const { network } = useAccountSettings();
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);
  const ConfirmExchangeButtonShadows = [
    [0, 3, 5, colors.shadowBlack, 0.2],
    [0, 6, 10, colors.shadowBlack, 0.14],
    [0, 1, 18, colors.shadowBlack, 0.12],
  ];

  let label =
    type === ExchangeModalTypes.deposit
      ? 'Hold to Deposit'
      : type === ExchangeModalTypes.withdrawal
      ? 'Hold to Withdraw '
      : 'Hold to Swap';
  if (!isSufficientBalance) {
    label = 'Insufficient Funds';
  } else if (!isSufficientLiquidity) {
    label = 'Insufficient Liquidity';
  } else if (!isSufficientGas) {
    label = `Insufficient ${nativeTokenSymbol}`;
  } else if (slippage > SlippageWarningThresholdInBips) {
    label = 'Swap Anyway';
  } else if (disabled) {
    label = 'Enter an Amount';
  }

  const isDisabled =
    disabled ||
    !isSufficientBalance ||
    !isSufficientGas ||
    !isSufficientLiquidity;

  return (
    <HoldToAuthorizeButton
      disabled={isDisabled}
      disabledBackgroundColor={colors.alpha(colors.blueGreyDark, 0.04)}
      hideInnerBorder
      isAuthorizing={isAuthorizing}
      label={label}
      onPress={onSubmit}
      shadows={ConfirmExchangeButtonShadows}
      testID={testID}
      theme="dark"
      {...props}
    />
  );
};

export default React.memo(ConfirmExchangeButton);
