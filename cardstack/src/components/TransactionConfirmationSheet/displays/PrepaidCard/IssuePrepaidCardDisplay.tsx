import { convertRawAmountToBalance } from '@cardstack/cardpay-sdk';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { SectionHeaderText } from '../components/SectionHeaderText';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import {
  Container,
  HorizontalDivider,
  Icon,
  NetworkBadge,
  Text,
  TransactionConfirmationDisplayProps,
} from '@cardstack/components';
import {
  IssuePrepaidCardDecodedData,
  DepotType,
  MerchantSafeType,
} from '@cardstack/types';
import {
  getDepotTokenByAddress,
  convertSpendForBalanceDisplay,
  getAddressPreview,
} from '@cardstack/utils';
import { useAccountProfile } from '@rainbow-me/hooks';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import { useGetSafesDataQuery } from '@cardstack/services';

interface IssuePrepaidCardDisplayProps
  extends TransactionConfirmationDisplayProps {
  data: IssuePrepaidCardDecodedData;
}

export type IssuableSafeType = DepotType | MerchantSafeType;

export const IssuePrepaidCardDisplay = (
  props: IssuePrepaidCardDisplayProps
) => {
  const { data, message } = props;

  return (
    <>
      <FromSection safeAddress={data.safeAddress} tokenAddress={message.to} />
      <HorizontalDivider />
      <LoadSection data={data} />
      <HorizontalDivider />
      <ToSection />
    </>
  );
};

const FromSection = ({
  safeAddress,
  tokenAddress,
}: {
  safeAddress?: string;
  tokenAddress: string;
}) => {
  const {
    accountAddress,
    accountColor,
    accountName,
    accountSymbol,
  } = useAccountProfile();

  const [nativeCurrency] = useNativeCurrencyAndConversionRates();

  const { fromSafes } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      selectFromResult: ({ data }) => ({
        fromSafes: [
          ...(data?.merchantSafes || []),
          ...(data?.depots || []),
        ].filter(safe => safe && safe.address === safeAddress),
      }),
    }
  );

  const fromSafe = fromSafes?.[0];

  const safeTypeText =
    fromSafe?.type === 'depot' ? 'DEPOT' : fromSafe?.merchantInfo?.name;

  const token = getDepotTokenByAddress(fromSafe, tokenAddress);
  const tokenBalance = token ? token.balance.display : 'Insufficient Funds';

  return (
    <Container marginTop={8} width="100%">
      <SectionHeaderText>FROM</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <ContactAvatar
            color={accountColor}
            size="smaller"
            value={accountSymbol}
          />
          <Container marginLeft={4}>
            <Text weight="extraBold">{accountName}</Text>
            <NetworkBadge marginTop={2} />
            {fromSafe ? (
              <Container flexDirection="row" marginTop={2}>
                <Container backgroundColor="black" width={2} height="100%" />
                <Container marginLeft={4}>
                  <Text size="xxs" weight="bold">
                    {safeTypeText}
                  </Text>
                  <Container maxWidth={180} marginTop={1}>
                    <Text variant="subAddress">{safeAddress}</Text>
                  </Container>
                  <Text fontSize={15} weight="extraBold">
                    {tokenBalance}
                  </Text>
                </Container>
              </Container>
            ) : (
              <Container marginTop={2}>
                <ActivityIndicator size="small" />
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const LoadSection = ({ data }: { data: IssuePrepaidCardDecodedData }) => {
  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const tokenDisplay = convertRawAmountToBalance(
    data.issuingTokenAmounts[0],
    data.token
  );

  const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
    data.spendAmounts[0],
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container>
      <SectionHeaderText>LOAD THIS AMOUNT</SectionHeaderText>
      <Container marginLeft={12} marginTop={2}>
        <Text size="large" weight="extraBold">
          {nativeBalanceDisplay}
        </Text>
        <Text variant="subText">{tokenDisplay.display}</Text>
      </Container>
    </Container>
  );
};

const ToSection = () => {
  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
    '0',
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container width="100%">
      <SectionHeaderText>TO</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <Icon name="prepaid-card" />
          <Container marginLeft={4}>
            <Text weight="extraBold">Prepaid Card</Text>
            <Text variant="subAddress" marginTop={1}>
              {getAddressPreview('0xXXXXXXXXXXXX')}*
            </Text>
            <Text marginTop={2} size="xs">
              Current Face Value
            </Text>
            <Text marginTop={1} fontSize={15} weight="extraBold">
              {nativeBalanceDisplay}
            </Text>
            <Container
              width="100%"
              paddingRight={5}
              flexDirection="row"
              marginTop={4}
            >
              <Text size="small" color="blueText" marginRight={1}>
                *
              </Text>
              <Text size="small" color="blueText">
                The address will be confirmed once the transaction is complete
              </Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
