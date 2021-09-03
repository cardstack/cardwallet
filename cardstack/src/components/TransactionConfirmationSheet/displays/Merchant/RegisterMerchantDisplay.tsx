import React, { useEffect, useMemo, useState } from 'react';

import { PrepaidCardTransactionSection } from '../components/sections/PrepaidCardTransactionSection';
import { TransactionConfirmationDisplayProps } from '../../TransactionConfirmationSheet';
import { PayThisAmountSection } from '../components/sections/PayThisAmountSection';
import TransactionListItem from '../components/TransactionListItem';
import {
  MerchantInformation,
  RegisterMerchantDecodedData,
} from '@cardstack/types';
import { fetchMerchantInfoFromDID } from '@cardstack/utils';
import { logger } from '@rainbow-me/utils';
import { useAccountProfile } from '@rainbow-me/hooks';

interface RegisterMerchantDisplayProps
  extends TransactionConfirmationDisplayProps {
  data: RegisterMerchantDecodedData;
}

export const RegisterMerchantDisplay = ({
  data: { infoDID, prepaidCard, spendAmount },
}: RegisterMerchantDisplayProps) => {
  const [merchantInfoDID, setMerchantInfoDID] = useState<MerchantInformation>();

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

  useEffect(() => {
    const getMerchantInfoDID = async () => {
      try {
        const info = await fetchMerchantInfoFromDID(infoDID);
        setMerchantInfoDID(info);
      } catch (e) {
        logger.log('Error on getMerchantInfoDID', e);
      }
    };

    getMerchantInfoDID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
