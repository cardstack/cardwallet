import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { Icon } from '../icons';
import { SlackSheet } from '../sheet';
import {
  Button,
  Container,
  HorizontalDivider,
  Input,
  Text,
} from '@cardstack/components';
import { MerchantSafeType } from '@cardstack/types';
import {
  formatNative,
  getAddressPreview,
  localCurrencyToAbsNum,
} from '@cardstack/utils';
import { useDimensions } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';

const TOP_POSITION = 150;

export default function PaymentRequestExpandedState(props: {
  asset: MerchantSafeType;
}) {
  const { address } = props.asset;
  const { setOptions } = useNavigation();
  const { height: deviceHeight } = useDimensions();
  const [inputValue, setInputValue] = useState<string>();
  const [editMode, setEditMode] = useState<boolean>(true);

  useEffect(() => {
    setOptions({
      longFormHeight: Math.max(deviceHeight - TOP_POSITION, 667),
    });
  }, [setOptions, deviceHeight]);

  return (
    <>
      {/* @ts-ignore */}
      <SlackSheet
        bottomInset={42}
        hasKeyboard
        height="100%"
        renderFooter={() =>
          editMode ? (
            <Container paddingHorizontal={5}>
              <Button
                disabled={!inputValue}
                onPress={() => setEditMode(false)}
                variant={!inputValue ? 'dark' : undefined}
              >{`${!inputValue ? 'Enter' : 'Confirm'} Amount`}</Button>
            </Container>
          ) : undefined
        }
        renderHeader={() => <MerchantInfo address={address} />}
        scrollEnabled
      >
        <Container
          flex={1}
          flexDirection="row"
          justifyContent="space-between"
          marginTop={!editMode ? 9 : 15}
          paddingHorizontal={5}
          width="100%"
        >
          <Text size="medium">Payment Request</Text>
          {!editMode && (
            <Text
              fontSize={12}
              fontWeight="600"
              marginTop={2}
              onPress={() => setEditMode(true)}
            >
              Edit amount
            </Text>
          )}
        </Container>
        {editMode ? (
          <>
            <InputAmount
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            <Container paddingHorizontal={5}>
              <HorizontalDivider />
              <SpendAmount usdFormat={inputValue} />
            </Container>
          </>
        ) : (
          <AmountAndQRCodeButtons address={address} usdFormat={inputValue} />
        )}
      </SlackSheet>
    </>
  );
}

const MerchantInfo = ({ address }: { address: string }) => (
  <Container
    alignItems="center"
    flexDirection="column"
    paddingTop={5}
    width="100%"
  >
    <Text size="medium" weight="extraBold">
      Mandello
    </Text>
    <Text
      color="blueText"
      size="xxs"
      textTransform="uppercase"
      weight="regular"
    >
      Merchant
    </Text>
    <Text marginTop={1} size="xs" weight="regular">
      {getAddressPreview(address)}
    </Text>
  </Container>
);

type InputAmountProps = {
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
};

const InputAmount = ({ inputValue, setInputValue }: InputAmountProps) => {
  return (
    <Container
      flex={1}
      flexDirection="row"
      marginTop={8}
      paddingHorizontal={5}
      width="100%"
    >
      <Text
        color={inputValue ? 'black' : 'underlineGray'}
        fontWeight="bold"
        paddingRight={1}
        paddingTop={1}
        size="largeBalance"
      >
        $
      </Text>
      <Container flex={1} flexGrow={1}>
        <Input
          alignSelf="stretch"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          color="black"
          fontSize={30}
          fontWeight="bold"
          keyboardType="numeric"
          maxLength={(inputValue || '').length + 2} // just to avoid possible flicker issue
          multiline
          onChangeText={text => setInputValue(formatNative(text))}
          placeholder="0.00"
          placeholderTextColor="grayMediumLight"
          spellCheck={false}
          testID="RequestPaymentInput"
          value={inputValue}
          zIndex={1}
        />
      </Container>
      <Text paddingLeft={1} paddingTop={1} size="largeBalance">
        USD
      </Text>
    </Container>
  );
};

const SpendAmount = ({ usdFormat }: { usdFormat: string | undefined }) => (
  <Text color="blueText" size="xs">{`§${
    usdFormat
      ? formatNative(
          `${new BigNumber(localCurrencyToAbsNum(usdFormat))
            .times(100)
            .toFixed()}`
        )
      : 0
  } SPEND`}</Text>
);

const AmountAndQRCodeButtons = ({
  usdFormat,
  address,
}: {
  usdFormat: string | undefined;
  address: string;
}) => {
  return (
    <Container paddingHorizontal={5} width="100%">
      <Container flexDirection="row" marginTop={8}>
        <Text color="blueText" fontWeight="bold" paddingTop={1} size="xxs">
          PAY:
        </Text>
        <Container paddingLeft={6}>
          <Text fontSize={15} fontWeight="bold">
            {`$${usdFormat} USD`}
          </Text>
          <SpendAmount usdFormat={usdFormat} />
        </Container>
      </Container>
      <Container flexDirection="row" marginTop={3}>
        <Text color="blueText" fontWeight="bold" paddingTop={1} size="xxs">
          TO:
        </Text>
        <Container paddingLeft={7} width={205}>
          <Text color="blueText" size="small">
            {address}
          </Text>
        </Container>
      </Container>
      <Container marginTop={1}>
        <HorizontalDivider />
        <Container
          alignItems="center"
          alignSelf="center"
          flexDirection="row"
          justifyContent="center"
          marginTop={4}
          width={200}
        >
          <Icon name="qrCodeBig" />
          <Text
            fontSize={15}
            fontWeight="600"
            letterSpacing={0.15}
            lineHeight={20}
            paddingLeft={3}
          >
            Let your customer scan a QR code to pay
          </Text>
        </Container>
      </Container>
      <Container marginTop={6}>
        <Button onPress={() => {}}>Show QR code</Button>
        <Container
          alignItems="center"
          alignSelf="center"
          flexDirection="row"
          justifyContent="center"
          marginTop={7}
          width={200}
        >
          <Icon name="link" />
          <Text
            fontSize={15}
            fontWeight="600"
            letterSpacing={0.15}
            lineHeight={20}
            paddingLeft={3}
          >
            Or send your customer the link to pay
          </Text>
        </Container>
      </Container>
      <Container
        flex={1}
        flexDirection="row"
        flexWrap="wrap"
        marginTop={6}
        width="100%"
      >
        <Container flex={1} paddingRight={2}>
          <Button onPress={() => {}} variant="small">
            Copy Link
          </Button>
        </Container>
        <Container flex={1} paddingLeft={2}>
          <Button onPress={() => {}} variant="small">
            Share Link
          </Button>
        </Container>
      </Container>
    </Container>
  );
};
