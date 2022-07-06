import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@cardstack/components';

import { useAccountSettings } from '@rainbow-me/hooks';

const SendButton = ({
  assetAmount,
  isAuthorizing,
  isSufficientBalance,
  isSufficientGas,
  onPress,
  testID,
  ...props
}) => {
  const isZeroAssetAmount = Number(assetAmount) <= 0;
  const { network } = useAccountSettings();
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  let disabled = true;
  let label = 'Enter an Amount';

  if (!isZeroAssetAmount && !isSufficientGas) {
    disabled = true;
    label = `Insufficient ${nativeTokenSymbol}`;
  } else if (!isZeroAssetAmount && !isSufficientBalance) {
    disabled = true;
    label = 'Insufficient Funds';
  } else if (!isZeroAssetAmount) {
    disabled = false;
    label = 'Hold to Send';
  }

  return (
    <Button
      {...props}
      disabled={disabled}
      loading={isAuthorizing}
      onLongPress={onPress}
      testID={testID}
    >
      {label}
    </Button>
  );
};

SendButton.propTypes = {
  assetAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isAuthorizing: PropTypes.bool,
  isSufficientBalance: PropTypes.bool,
  isSufficientGas: PropTypes.bool,
  onPress: PropTypes.func,
};

export default React.memo(SendButton);
