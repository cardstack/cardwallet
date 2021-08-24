import React, { useEffect, useState } from 'react';
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
  localCurrencyToNum,
  // convertSpendForBalanceDisplay,
  getAddressPreview,
} from '@cardstack/utils';

import { useDimensions } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';

const TOP_POSITION = 160;

export default function PaymentRequestExpandedState(props: {
  asset: MerchantSafeType;
}) {
  const { address } = props.asset;
  const { setOptions } = useNavigation();
  const { height: deviceHeight } = useDimensions();
  const [inputValue, setInputValue] = useState<string>();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setOptions({
      longFormHeight: deviceHeight - TOP_POSITION,
    });
  }, [setOptions, deviceHeight]);

  return (
    <SlackSheet height="100%" scrollEnabled>
      <MerchantInfo address={address} />
      <Container marginTop={18} paddingHorizontal={5}>
        <Text size="medium">Payment Request</Text>
      </Container>
      <Container
        flex={1}
        flexDirection="row"
        marginTop={8}
        paddingHorizontal={5}
        width="100%"
      >
        <Text
          color={inputValue ? 'black' : 'underlineGray'}
          fontSize={30}
          fontWeight="bold"
          paddingRight={1}
          paddingVertical={1}
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
            // onChange={handleChange}
            fontWeight="bold"
            keyboardType="numeric"
            maxLength={(formatNative(inputValue) || '').length + 2} // just to avoid possible flicker issue
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
        <Text fontSize={30} paddingLeft={1} paddingVertical={1}>
          USD
        </Text>
      </Container>
      <Container paddingHorizontal={5}>
        <HorizontalDivider />
        <Text color="blueText" fontSize={13}>{`§ ${
          inputValue
            ? formatNative(`${localCurrencyToNum(inputValue) * 100}`)
            : 0
        } SPEND`}</Text>
        <Container marginTop={20}>
          <Button disabled={!inputValue}>{`${
            !inputValue ? 'Enter' : 'Confirm'
          } Amount`}</Button>
        </Container>
      </Container>
    </SlackSheet>
  );
}

const MerchantInfo = ({ address }: { address: string }) => (
  <Container
    alignItems="center"
    flexDirection="column"
    paddingVertical={1}
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
