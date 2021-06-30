import { convertRawAmountToBalance } from '@cardstack/cardpay-sdk';
import React from 'react';
import { ContactAvatar } from '../../../../src/components/contacts';
import { GenericDisplay } from './GenericDisplay';
import { TransactionConfirmationSectionHeaderText } from './TransactionConfirmationSectionHeaderText';
import {
  Container,
  HorizontalDivider,
  Icon,
  NetworkBadge,
  Text,
  TransactionConfirmationSheetProps,
} from '@cardstack/components';
import { IssuePrepaidCardDecodedData } from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  getAddressPreview,
} from '@cardstack/utils';
import { useAccountProfile } from '@rainbow-me/hooks';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';

export const IssuePrepaidCardDisplay = (
  props: TransactionConfirmationSheetProps
) => {
  const { message, decodedData } = props;

  if (!decodedData || decodedData.type !== 'issuePrepaidCard') {
    return <GenericDisplay {...props} />;
  }

  return (
    <>
      <FromSection tokenAddress={message.to} />
      <HorizontalDivider />
      <LoadSection decodedData={decodedData} />
      <HorizontalDivider />
      <ToSection />
    </>
  );
};

const FromSection = ({ tokenAddress }: { tokenAddress: string }) => {
  const { accountColor, accountName, accountSymbol } = useAccountProfile();

  const depots = useRainbowSelector(state => state.data.depots);
  const depot = depots[0];

  const token = depot.tokens.find(
    t => t.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
  );

  const tokenBalance = token ? token.balance.display : 'Insufficient Funds';

  return (
    <Container marginTop={8} width="100%">
      <TransactionConfirmationSectionHeaderText>
        FROM
      </TransactionConfirmationSectionHeaderText>
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
            {depot && (
              <Container flexDirection="row" marginTop={2}>
                <Container backgroundColor="black" width={2} height="100%" />
                <Container marginLeft={4}>
                  <Text size="xxs" weight="bold">
                    DEPOT
                  </Text>
                  <Container maxWidth={180} marginTop={1}>
                    <Text
                      size="small"
                      color="blueText"
                      fontFamily="RobotoMono-Regular"
                    >
                      {depot.address}
                    </Text>
                  </Container>
                  <Text fontSize={15} weight="extraBold">
                    {tokenBalance}
                  </Text>
                </Container>
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const LoadSection = ({
  decodedData,
}: {
  decodedData: IssuePrepaidCardDecodedData;
}) => {
  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const tokenDisplay = convertRawAmountToBalance(
    decodedData.issuingTokenAmounts[0],
    decodedData.token
  );

  const spendDisplay = convertSpendForBalanceDisplay(
    decodedData.spendAmounts[0],
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container>
      <TransactionConfirmationSectionHeaderText>
        LOAD THIS AMOUNT
      </TransactionConfirmationSectionHeaderText>
      <Container marginLeft={12} marginTop={2}>
        <Text size="large" weight="extraBold">
          {spendDisplay.tokenBalanceDisplay}
        </Text>
        <Text variant="subText">{spendDisplay.nativeBalanceDisplay}</Text>
        <Text variant="subText">{tokenDisplay.display}</Text>
      </Container>
    </Container>
  );
};

const ToSection = () => {
  const [nativeCurrency, currencyConversionRates] = useRainbowSelector<
    [string, { [key: string]: number }]
  >(state => [state.settings.nativeCurrency, state.currencyConversion.rates]);

  const zeroSpendDisplay = convertSpendForBalanceDisplay(
    '0',
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container width="100%">
      <TransactionConfirmationSectionHeaderText>
        TO
      </TransactionConfirmationSectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <Icon name="prepaid-card" />
          <Container marginLeft={4}>
            <Text weight="extraBold">Prepaid Card</Text>
            <Text
              size="small"
              color="blueText"
              fontFamily="RobotoMono-Regular"
              marginTop={1}
            >
              {getAddressPreview('0x000000000000')}*
            </Text>
            <Text marginTop={2} size="xs">
              Current Face Value
            </Text>
            <Text marginTop={1} fontSize={15} weight="extraBold">
              {zeroSpendDisplay.tokenBalanceDisplay}
            </Text>
            <Text size="xs" color="blueText">
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
