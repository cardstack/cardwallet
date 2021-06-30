import React from 'react';
import { TransactionConfirmationDisplayProps } from './TransactionConfirmationSheet';
import { TransactionConfirmationSectionHeaderText } from './TransactionConfirmationSectionHeaderText';
import { PayMerchantDecodedData } from '@cardstack/types';
import {
  Container,
  Icon,
  NetworkBadge,
  Text,
  HorizontalDivider,
} from '@cardstack/components';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';

interface PayMerchantDisplayProps extends TransactionConfirmationDisplayProps {
  data: PayMerchantDecodedData;
}

export const PayMerchantDisplay = (props: PayMerchantDisplayProps) => {
  return (
    <>
      <FromSection {...props} />
      <HorizontalDivider />
      <PayThisAmountSection {...props} />
      <HorizontalDivider />
      <ToSection {...props} />
    </>
  );
};

const FromSection = ({ data }: PayMerchantDisplayProps) => {
  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const prepaidCards = useRainbowSelector(state => state.data.prepaidCards);

  const prepaidCard = prepaidCards.find(
    card => card.address === data.prepaidCard
  );

  const spendDisplay = convertSpendForBalanceDisplay(
    String(prepaidCard?.spendFaceValue || 0),
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container marginTop={8} width="100%">
      <TransactionConfirmationSectionHeaderText>
        FROM
      </TransactionConfirmationSectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <Icon name="prepaid-card" />
          <Container marginLeft={2}>
            <Text weight="extraBold">Prepaid Card</Text>
            <NetworkBadge marginTop={2} />
            <Container maxWidth={180} marginTop={1}>
              <Text variant="subAddress">{data.prepaidCard}</Text>
            </Container>
            {prepaidCard && (
              <Container marginTop={3}>
                <Text fontSize={12}>Spendable Balance</Text>
                <Text fontSize={15} weight="extraBold">
                  {spendDisplay.tokenBalanceDisplay}
                </Text>
                <Text variant="subText">
                  {spendDisplay.nativeBalanceDisplay}
                </Text>
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const PayThisAmountSection = ({ data }: PayMerchantDisplayProps) => {
  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const spendDisplay = convertSpendForBalanceDisplay(
    String(data.spendAmount),
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container>
      <TransactionConfirmationSectionHeaderText>
        PAY THIS AMOUNT
      </TransactionConfirmationSectionHeaderText>
      <Container marginLeft={12} marginTop={2}>
        <Text size="large" weight="extraBold">
          {spendDisplay.tokenBalanceDisplay}
        </Text>
        <Text variant="subText">{spendDisplay.nativeBalanceDisplay}</Text>
      </Container>
    </Container>
  );
};

const ToSection = ({ data }: PayMerchantDisplayProps) => {
  return (
    <Container>
      <TransactionConfirmationSectionHeaderText>
        TO
      </TransactionConfirmationSectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4} flexDirection="row">
        <Icon name="user" />
        <Container marginLeft={4}>
          <Text variant="subText">Merchant</Text>
          <Text size="small" weight="extraBold">
            Merchant Name
          </Text>
          <Container maxWidth={180} marginTop={2}>
            <Text variant="subAddress">{data.merchantSafe}</Text>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
