import BigNumber from 'bignumber.js';
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

  useEffect(() => {
    setOptions({
      longFormHeight: Math.max(deviceHeight - TOP_POSITION, 667),
    });
  }, [setOptions, deviceHeight]);

  return (
    <SlackSheet
      hasKeyboard
      height="100%"
      renderFooter={() => (
        <Container paddingHorizontal={5}>
          <Button
            disabled={!inputValue}
            variant={!inputValue ? 'dark' : undefined}
          >{`${!inputValue ? 'Enter' : 'Confirm'} Amount`}</Button>
        </Container>
      )}
      renderHeader={() => <MerchantInfo address={address} />}
    >
      <Container marginTop={16} paddingHorizontal={5}>
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
        <Text fontSize={30} paddingLeft={1} paddingVertical={1}>
          USD
        </Text>
      </Container>
      <Container paddingHorizontal={5}>
        <HorizontalDivider />
        <Text color="blueText" fontSize={13}>{`§ ${
          inputValue
            ? formatNative(
                `${new BigNumber(localCurrencyToAbsNum(inputValue))
                  .times(100)
                  .toFixed()}`
              )
            : 0
        } SPEND`}</Text>
      </Container>
    </SlackSheet>
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
