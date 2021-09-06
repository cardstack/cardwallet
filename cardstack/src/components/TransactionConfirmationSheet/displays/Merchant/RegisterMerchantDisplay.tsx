import React, { useMemo } from 'react';

import { PrepaidCardTransactionSection } from '../components/sections/PrepaidCardTransactionSection';
import { TransactionConfirmationDisplayProps } from '../../TransactionConfirmationSheet';
import { PayThisAmountSection } from '../components/sections/PayThisAmountSection';
import TransactionListItem from '../components/TransactionListItem';
import { useMerchantInfoDID } from './hooks';
import { RegisterMerchantDecodedData } from '@cardstack/types';
import { useAccountProfile } from '@rainbow-me/hooks';

interface RegisterMerchantDisplayProps
  extends TransactionConfirmationDisplayProps {
  data: RegisterMerchantDecodedData;
}

export const RegisterMerchantDisplay = ({
  data: { infoDID, prepaidCard, spendAmount },
}: RegisterMerchantDisplayProps) => {
  const { merchantInfoDID } = useMerchantInfoDID(infoDID);

  const {
    accountColor,
    accountName,
    accountSymbol,
    accountAddress,
  } = useAccountProfile();

  const accountAvatarInfo = useMemo(
    () => ({
      color: accountColor,
      name: accountSymbol || '?',
    }),
    [accountColor, accountSymbol]
  );

  return (
    <>
      <TransactionListItem
        headerText="FROM"
        title={accountName}
        avatarInfo={accountAvatarInfo}
        showNetworkBadge
        address={accountAddress}
      />
      {merchantInfoDID && (
        <TransactionListItem
          headerText="CREATE THIS MERCHANT"
          title={merchantInfoDID.name || 'Merchant Name'}
          avatarInfo={merchantInfoDID}
          address={merchantInfoDID.slug}
        />
      )}
      <PrepaidCardTransactionSection
        headerText="PAY WITH"
        prepaidCardAddress={prepaidCard}
      />
      <PayThisAmountSection
        headerText="PAY MERCHANT CREATION FEE"
        spendAmount={spendAmount}
      />
    </>
  );
};
