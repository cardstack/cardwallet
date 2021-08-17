import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import lang from 'i18n-js';
import React from 'react';
import { Text } from '../../text';
import TransactionRow from '../TransactionRow';
import TransactionSheet from '../TransactionSheet';
import { TruncatedAddress } from '@cardstack/components';
import { useAccountSettings } from '@rainbow-me/hooks';

export default function DefaultTransactionConfirmationSection({
  address,
  value = '0',
}) {
  const { network } = useAccountSettings();
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  return (
    <TransactionSheet>
      <TransactionRow title={lang.t('wallet.action.to')}>
        <TruncatedAddress
          address={address}
          color="darkGrayText"
          size="medium"
        />
      </TransactionRow>
      <TransactionRow title={lang.t('wallet.action.value')}>
        <Text color="blueGreyDark50" size="lmedium" uppercase>
          {value} {nativeTokenSymbol}
        </Text>
      </TransactionRow>
    </TransactionSheet>
  );
}
