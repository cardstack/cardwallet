import React, { memo, useMemo } from 'react';
import { useRoute } from '@react-navigation/core';
import { strings } from './strings';
import {
  BlockscoutButton,
  Container,
  EarnedTransaction,
  HorizontalDivider,
  MerchantPaymentItemDetail,
  Sheet,
  Text,
} from '@cardstack/components';
import {
  Asset,
  TransactionRow,
} from '@cardstack/components/Transactions/TransactionBase';
import { MerchantClaimTypeTxn } from '@cardstack/types';
import { RouteType } from '@cardstack/navigation/types';
import { useAccountSettings } from '@rainbow-me/hooks';

interface ClaimedTransactionProps extends MerchantClaimTypeTxn {
  txRowProps: Asset;
}

const ClaimedTransaction = ({
  grossClaimed,
  gasNativeFee,
  gasFee,
  netClaimed,
  txRowProps,
}: ClaimedTransactionProps) => (
  <>
    <TransactionRow
      {...txRowProps}
      hasBottomDivider
      marginHorizontal={3}
      paddingHorizontal={0}
    />
    <Container padding={5}>
      <MerchantPaymentItemDetail
        description={strings.revenueClaimed}
        symbol={txRowProps.symbol}
        value={grossClaimed}
      />
      <MerchantPaymentItemDetail
        description={strings.gasFee}
        subValue={gasNativeFee}
        symbol={txRowProps.symbol}
        value={gasFee}
      />
      <HorizontalDivider />
      <MerchantPaymentItemDetail
        description={strings.netClaimed}
        symbol={txRowProps.symbol}
        value={netClaimed}
      />
    </Container>
  </>
);

const MerchantTransactionSheet = () => {
  const {
    params: { item, isClaimedTransaction },
  } = useRoute<RouteType<any>>();

  const { network } = useAccountSettings();

  const txBaseProps = useMemo(
    () => ({
      ...item.transaction,
      txRowProps: { ...item, symbol: item.token.symbol },
    }),
    [item]
  );

  const earnedTxProps = useMemo(
    () => ({
      ...txBaseProps,
      txRowProps: {
        ...txBaseProps.txRowProps,
        primaryText: `+ ${item.transaction?.netEarned?.display}`,
        subText: item.transaction?.netEarnedNativeDisplay,
        symbol: item.token.symbol,
      },
    }),
    [item, txBaseProps]
  );

  return (
    <Sheet>
      <Container backgroundColor="white" padding={5}>
        <Text marginBottom={10} size="medium">
          {strings.title}
        </Text>
        <Container
          backgroundColor="white"
          borderColor="borderGray"
          borderRadius={10}
          borderWidth={1}
          marginBottom={8}
          paddingRight={4}
        >
          {isClaimedTransaction ? (
            <ClaimedTransaction {...txBaseProps} />
          ) : (
            <EarnedTransaction {...earnedTxProps} />
          )}
        </Container>
        <BlockscoutButton
          network={network}
          transactionHash={item.transactionHash}
        />
      </Container>
    </Sheet>
  );
};

export default memo(MerchantTransactionSheet);
