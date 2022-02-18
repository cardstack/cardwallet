import { convertRawAmountToBalance } from '@cardstack/cardpay-sdk';
import React from 'react';
import { SectionHeaderText } from '../components/SectionHeaderText';
import {
  Container,
  HorizontalDivider,
  Icon,
  NetworkBadge,
  Text,
  TransactionConfirmationDisplayProps,
} from '@cardstack/components';
import { SplitPrepaidCardDecodedData } from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  getAddressPreview,
} from '@cardstack/utils';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';

interface SplitPrepaidCardDisplayProps
  extends TransactionConfirmationDisplayProps {
  data: SplitPrepaidCardDecodedData;
}

export const SplitPrepaidCardDisplay = (
  props: SplitPrepaidCardDisplayProps
) => {
  const { data } = props;

  return (
    <>
      <FromSection data={data} />
      <HorizontalDivider />
      <DeductSection data={data} />
      <HorizontalDivider />
      <DistributeSection data={data} />
    </>
  );
};

const FromSection = ({ data }: { data: SplitPrepaidCardDecodedData }) => {
  const prepaidCards = useRainbowSelector(state => state.data.prepaidCards);

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const prepaidCard = prepaidCards.find(
    card => card.address === data.prepaidCard
  );

  const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
    prepaidCard?.spendFaceValue || 0,
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container marginTop={8} width="100%">
      <SectionHeaderText>FROM</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <Icon name="prepaid-card" />
          <Container marginLeft={4}>
            <Text weight="extraBold">Prepaid Card</Text>
            <NetworkBadge marginTop={2} />
            <Container maxWidth={180} marginTop={1}>
              <Text variant="subAddress">{data.prepaidCard}</Text>
            </Container>
            {prepaidCard && (
              <Container marginTop={2}>
                <Text size="xxs">Face Value</Text>
                <Text fontSize={15} weight="extraBold">
                  {nativeBalanceDisplay}
                </Text>
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const DeductSection = ({ data }: { data: SplitPrepaidCardDecodedData }) => {
  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const issuingTokenTotal = data.issuingTokenAmounts.reduce<number>(
    (total, amount) => total + Number(amount),
    0
  );

  const spendAmountTotal = data.spendAmounts.reduce<number>(
    (total, amount) => total + Number(amount),
    0
  );

  const tokenDisplay = convertRawAmountToBalance(issuingTokenTotal, data.token);

  const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
    spendAmountTotal,
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container>
      <SectionHeaderText>DEDUCT THIS AMOUNT</SectionHeaderText>
      <Container marginLeft={12} marginTop={2}>
        <Text size="large" weight="extraBold">
          {nativeBalanceDisplay}
        </Text>
        <Text variant="subText">{tokenDisplay.display}</Text>
      </Container>
    </Container>
  );
};

const DistributeSection = ({ data }: { data: SplitPrepaidCardDecodedData }) => {
  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const zeroSpendDisplay = convertSpendForBalanceDisplay(
    '0',
    nativeCurrency,
    currencyConversionRates,
    true
  );

  const spendDisplay = convertSpendForBalanceDisplay(
    data.spendAmounts[0],
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container width="100%">
      <SectionHeaderText>DISTRIBUTE THIS AMOUNT TO</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <Icon name="prepaid-card" />
          <Container marginLeft={4}>
            <Text weight="extraBold">{`Prepaid Card x ${data.spendAmounts.length}`}</Text>
            <Text weight="extraBold">{`${spendDisplay.nativeBalanceDisplay} each`}</Text>
            <Text variant="subAddress" marginTop={1}>
              {getAddressPreview('0xXXXXXXXXXXXX')}*
            </Text>
            <Text marginTop={2} size="xs">
              Current Face Value
            </Text>
            <Text marginTop={1} fontSize={15} weight="extraBold">
              {zeroSpendDisplay.nativeBalanceDisplay}
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
