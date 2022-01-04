import React, { useEffect, useMemo } from 'react';
import { SlackSheet } from '../sheet';
import {
  BlockscoutButton,
  Container,
  EarnedTransaction,
  HorizontalDivider,
  MerchantPaymentItemDetail,
  Text,
} from '@cardstack/components';
import {
  Asset,
  TransactionRow,
} from '@cardstack/components/Transactions/TransactionBase';
import { MerchantClaimTypeTxn } from '@cardstack/types';
import { ClaimStatuses } from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

interface MerchantTransactionExpandedStateProps {
  asset: Asset;
  type: string;
}

interface ClaimedTransactionProps extends MerchantClaimTypeTxn {
  txRowProps: Asset;
}

const ClaimedTransaction = ({
  grossClaimed,
  gasNativeFee,
  gasFee,
  netClaimed,
  txRowProps,
}: ClaimedTransactionProps) => {
  return (
    <>
      <TransactionRow {...txRowProps} hasBottomDivider />
      <Container padding={6}>
        <MerchantPaymentItemDetail
          description={'REVENUE \nCLAIMED'}
          value={grossClaimed}
        />
        <MerchantPaymentItemDetail
          description="GAS FEE"
          subValue={gasNativeFee}
          value={gasFee}
        />
        <HorizontalDivider />
        <MerchantPaymentItemDetail
          description="NET CLAIMED"
          value={netClaimed}
        />
      </Container>
    </>
  );
};

const CHART_HEIGHT = 650;

export const MerchantTransactionExpandedStateBody = (
  props: MerchantTransactionExpandedStateProps
) => {
  const transactionData =
    props.asset?.section?.data[props.asset.index]?.transaction;
  const earnedTxnData = {
    ...transactionData,
    subText: transactionData.netEarned.display,
  };

  const rowProps = {
    ...props.asset,
    primaryText: `+ ${transactionData.netEarned}`,
    subText: transactionData.netEarnedNativeDisplay,
  };

  const isClaimedTransaction = Object.values<string>(ClaimStatuses).includes(
    props.asset.claimStatus
  );

  return (
    <Container
      backgroundColor="white"
      borderColor="borderGray"
      borderRadius={10}
      borderWidth={1}
      marginBottom={8}
      overflow="scroll"
      paddingHorizontal={2}
    >
      {isClaimedTransaction ? (
        <ClaimedTransaction {...transactionData} txRowProps={props.asset} />
      ) : (
        <EarnedTransaction {...earnedTxnData} txRowProps={rowProps} />
      )}
    </Container>
  );
};

export default function MerchantTransactionExpandedState(
  props: MerchantTransactionExpandedStateProps
) {
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);

  const network = useRainbowSelector(state => state.settings.network);
  return useMemo(
    () => (
      <SlackSheet flex={1} scrollEnabled>
        <Container backgroundColor="white" marginBottom={32} padding={8}>
          <Text marginBottom={10} size="medium">
            Transaction details
          </Text>
          <MerchantTransactionExpandedStateBody {...props} />
          <BlockscoutButton
            network={network}
            transactionHash={props.asset.transactionHash}
          />
        </Container>
      </SlackSheet>
    ),
    [network, props]
  );
}
