import React from 'react';
import { PrepaidCardTransactionSection } from '../components/sections/PrepaidCardTransactionSection';
import { PayThisAmountSection } from '../components/sections/PayThisAmountSection';
import TransactionListItem from '../components/TransactionListItem';
import { strings } from '../../strings';
import { TransactionConfirmationDisplayProps } from '@cardstack/components';
import { RegisterMerchantDecodedData } from '@cardstack/types';
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

  return (
    <>
      {merchantInfoData ? (
        <TransactionListItem
          headerText={strings.createProfile.create}
          title={merchantInfoData.name || strings.createProfile.profileName}
          avatarInfo={merchantInfoData}
        />
      ) : null}
      {prepaidCard ? (
        <PrepaidCardTransactionSection
          headerText={strings.createProfile.from}
          prepaidCardAddress={prepaidCard}
        />
      ) : null}
      <PayThisAmountSection
        headerText={strings.createProfile.payThisAmount}
        spendAmount={spendAmount}
      />
    </>
  );
};
