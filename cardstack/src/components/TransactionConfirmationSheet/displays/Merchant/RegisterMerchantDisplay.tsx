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
  data: { infoDID, merchantInfo, prepaidCard, spendAmount },
}: RegisterMerchantDisplayProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(infoDID);
  const merchantInfoData = merchantInfoDID || merchantInfo;

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
      {merchantInfoData ? (
        <TransactionListItem
          headerText="CREATE THIS BUSINESS ACCOUNT"
          title={merchantInfoData.name || 'Business Name'}
          avatarInfo={merchantInfoData}
          address={merchantInfoData.slug}
        />
      ) : null}
      {prepaidCard ? (
        <PrepaidCardTransactionSection
          headerText="PAY WITH"
          prepaidCardAddress={prepaidCard}
        />
      ) : null}
      <PayThisAmountSection
        headerText="PAY BUSINESS CREATION FEE"
        spendAmount={spendAmount}
      />
    </>
  );
};
