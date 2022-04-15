import React from 'react';

import { TransactionConfirmationDisplayProps } from '@cardstack/components';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';
import { RegisterMerchantDecodedData } from '@cardstack/types';

import { strings } from '../../strings';
import TransactionListItem from '../components/TransactionListItem';
import { PayThisAmountSection } from '../components/sections/PayThisAmountSection';
import { PrepaidCardTransactionSection } from '../components/sections/PrepaidCardTransactionSection';

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
      <PrepaidCardTransactionSection
        headerText={strings.createProfile.from}
        prepaidCardAddress={prepaidCard}
      />
      <PayThisAmountSection
        headerText={strings.createProfile.payThisAmount}
        spendAmount={spendAmount}
      />
    </>
  );
};
