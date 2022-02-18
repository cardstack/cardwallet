import { BlockNumber } from 'web3-core';
import React from 'react';
import { Icon } from '@cardstack/components';
import { PrepaidCardTransactionHeader } from '@cardstack/components/Transactions/PrepaidCard/PrepaidCardTransactionHeader';
import Web3Instance from '@cardstack/models/web3-instance';
import {
  MerchantInformation,
  PrepaidCardCustomization,
} from '@cardstack/types';
import logger from 'logger';

export const getBlockTimestamp = async (blockNumber: BlockNumber) => {
  try {
    const web3 = await Web3Instance.get();
    const block = await web3.eth.getBlock(blockNumber);
    return block?.timestamp.toString();
  } catch (error) {
    logger.log(error);
  }

  return Date.now().toString();
};

// Workaround to reuse tx confirmation, will revisit it
interface NavParams {
  merchantInfo?: MerchantInformation;
  spendAmount: number;
  nativeBalanceDisplay: string;
  timestamp: string;
  transactionHash: string;
  prepaidCardAddress: string;
  prepaidCardCustomization?: PrepaidCardCustomization;
}

export const mapPrepaidTxToNavigationParams = ({
  merchantInfo,
  spendAmount,
  nativeBalanceDisplay,
  timestamp,
  transactionHash,
  prepaidCardAddress,
  prepaidCardCustomization,
}: NavParams) => ({
  asset: {
    index: 0,
    section: {
      data: [
        {
          merchantInfo,
          spendAmount,
          nativeBalanceDisplay,
          timestamp,
          transactionHash,
        },
      ],
    },
    Header: (
      <PrepaidCardTransactionHeader
        address={prepaidCardAddress}
        cardCustomization={prepaidCardCustomization}
      />
    ),
    CoinIcon: <Icon name="spend" />,
    statusIconName: 'arrow-up',
    statusText: 'Paid',
    primaryText: nativeBalanceDisplay,
    transactionHash,
  },
  type: 'paymentConfirmationTransaction',
});
