import React, { useMemo } from 'react';

import { PrepaidCardTransactionSection } from '../components/sections/PrepaidCardTransactionSection';
import { PayThisAmountSection } from '../components/sections/PayThisAmountSection';
import TransactionListItem from '../components/TransactionListItem';
import { TransactionConfirmationDisplayProps } from '@cardstack/components';
import { RegisterMerchantDecodedData } from '@cardstack/types';
import { useAccountProfile } from '@rainbow-me/hooks';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';

interface RegisterMerchantDisplayProps
  extends TransactionConfirmationDisplayProps {
  data: RegisterMerchantDecodedData;
}

export const RegisterMerchantDisplay = ({
  data: { infoDID, prepaidCard, spendAmount },
}: RegisterMerchantDisplayProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(infoDID);

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
          headerText="CREATE THIS BUSINESS ACCOUNT"
          title={merchantInfoDID.name || 'Business Name'}
          avatarInfo={merchantInfoDID}
          address={merchantInfoDID.slug}
        />
      )}
      <PrepaidCardTransactionSection
        headerText="PAY WITH"
        prepaidCardAddress={prepaidCard}
      />
      <PayThisAmountSection
        headerText="PAY BUSINESS CREATION FEE"
        spendAmount={spendAmount}
      />
    </>
  );
};
