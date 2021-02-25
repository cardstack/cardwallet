import lang from 'i18n-js';
import React from 'react';
import { Text, TruncatedAddress } from '../../text';
import TransactionRow from '../TransactionRow';
import TransactionSheet from '../TransactionSheet';

export default function DefaultTransactionConfirmationSection({
  address,
  value = '0',
}) {
  const { colors } = useTheme();
  return (
    <TransactionSheet>
      <TransactionRow title={lang.t('wallet.action.to')}>
        <TruncatedAddress
          address={address}
          color={colors.blueGreyDark60}
          size="lmedium"
          style={{ marginTop: -15 }}
          truncationLength={15}
        />
      </TransactionRow>
      <TransactionRow
        style={{ marginTop: 15 }}
        title={lang.t('wallet.action.value')}
      >
        <Text color={colors.blueGreyDark60} size="lmedium" uppercase>
          {value} xDai
        </Text>
      </TransactionRow>
    </TransactionSheet>
  );
}
