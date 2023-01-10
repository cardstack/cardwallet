import { nativeCurrencies } from '@cardstack/cardpay-sdk';
import React, { Fragment } from 'react';

import { Container } from '@cardstack/components';

import { removeLeadingZeros } from '@rainbow-me/utils';

import SendAssetFormField from './SendAssetFormField';

export default function SendAssetFormToken({
  assetAmount,
  buttonRenderer,
  nativeAmount,
  nativeCurrency,
  onChangeAssetAmount,
  onChangeNativeAmount,
  onFocus,
  selected,
  sendMaxBalance,
  txSpeedRenderer,
  showNativeCurrencyField = true,
}) {
  const { mask: nativeMask, placeholder: nativePlaceholder } = nativeCurrencies[
    nativeCurrency
  ];

  return (
    <>
      <SendAssetFormField
        format={removeLeadingZeros}
        label={selected.symbol}
        marginTop={5}
        onChange={onChangeAssetAmount}
        onFocus={onFocus}
        onPressButton={sendMaxBalance}
        placeholder="0"
        testID="selected-asset-field"
        value={assetAmount}
      />
      {showNativeCurrencyField && (
        <SendAssetFormField
          autoFocus
          label={nativeCurrency}
          marginTop={10}
          mask={nativeMask}
          onChange={onChangeNativeAmount}
          onFocus={onFocus}
          onPressButton={sendMaxBalance}
          placeholder={nativePlaceholder}
          testID="selected-asset-quantity-field"
          value={nativeAmount}
        />
      )}
      <Container marginTop={5}>
        {buttonRenderer}
        {txSpeedRenderer}
      </Container>
    </>
  );
}
