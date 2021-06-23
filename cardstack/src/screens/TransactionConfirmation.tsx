import { convertRawAmountToBalance } from '@cardstack/cardpay-sdk';
import React, { useEffect, useState } from 'react';
import { ContactAvatar } from '../../../src/components/contacts';
import { GasSpeedButton } from '../../../src/components/gas';
import {
  Button,
  Container,
  HorizontalDivider,
  Icon,
  NetworkBadge,
  ScrollView,
  SheetHandle,
  Text,
} from '@cardstack/components';
import { DecodedData, getDecodedData } from '@cardstack/services';
import {
  convertSpendForBalanceDisplay,
  getAddressPreview,
} from '@cardstack/utils';
import {
  useAccountProfile,
  useTransactionConfirmationFunctions,
} from '@rainbow-me/hooks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const TransactionConfirmation = () => {
  const {
    dappUrl,
    message,
    onCancel,
    onPressSend,
    isMessageRequest,
  } = useTransactionConfirmationFunctions();

  return (
    <Container flex={1} width="100%">
      <Container
        flex={1}
        alignItems="center"
        backgroundColor="white"
        paddingTop={3}
        borderRadius={20}
      >
        <SheetHandle />
        <Header dappUrl={dappUrl} />
        <DisplayInformation message={message} />
        <SheetFooter onCancel={onCancel} onConfirm={onPressSend} />
      </Container>
      <Container height={150}>
        {!isMessageRequest && (
          <Container>
            <GasSpeedButton type="transaction" />
          </Container>
        )}
      </Container>
    </Container>
  );
};

const Header = ({ dappUrl }: { dappUrl: string }) => {
  const [, displayUrl] = dappUrl.split('://');

  return (
    <>
      <Text marginTop={4} weight="extraBold">
        Issue Prepaid Card
      </Text>
      <Text variant="subText" weight="bold">
        {displayUrl}
      </Text>
    </>
  );
};

const DisplayInformation = ({ message }: { message: any }) => {
  return (
    <ScrollView
      width="100%"
      paddingHorizontal={5}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <FromSection tokenAddress={message.to} />
      <HorizontalDivider />
      <LoadSection message={message} />
      <HorizontalDivider />
      <ToSection />
    </ScrollView>
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
      <Text size="xxs" weight="extraBold" color="blueText">
        FROM
      </Text>
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

const LoadSection = ({ message }: { message: any }) => {
  const [data, setData] = useState<DecodedData | null>(null);

  const [nativeCurrency, currencyConversionRates] = useRainbowSelector<
    [string, { [key: string]: number }]
  >(state => [state.settings.nativeCurrency, state.currencyConversion.rates]);

  useEffect(() => {
    const decodeData = async () => {
      const decodedData = await getDecodedData(message);

      setData(decodedData);
    };

    decodeData();
  }, [setData, message]);

  if (!data) {
    return null;
  }

  const spendAmount = data.spendAmounts[0];
  const issuingTokenAmount = data.issuingTokenAmounts[0];

  const tokenDisplay = convertRawAmountToBalance(
    issuingTokenAmount,
    data.token
  );

  const spendDisplay = convertSpendForBalanceDisplay(
    spendAmount,
    nativeCurrency,
    currencyConversionRates,
    true
  );

  return (
    <Container>
      <Text size="xxs" weight="extraBold" color="blueText">
        LOAD THIS AMOUNT
      </Text>
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
      <Text size="xxs" weight="extraBold" color="blueText">
        TO
      </Text>
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

const SheetFooter = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Container
      width="100%"
      bottom={20}
      position="absolute"
      backgroundColor="white"
    >
      <HorizontalDivider height={2} marginBottom={4} marginVertical={0} />
      <Container
        paddingHorizontal={5}
        flexDirection="row"
        justifyContent="space-between"
      >
        <Button variant="smallWhite" onPress={onCancel}>
          Cancel
        </Button>
        <Button
          variant="small"
          onPress={onConfirm}
          iconProps={{ name: 'face-id' }}
        >
          Confirm
        </Button>
      </Container>
    </Container>
  );
};

export default TransactionConfirmation;
