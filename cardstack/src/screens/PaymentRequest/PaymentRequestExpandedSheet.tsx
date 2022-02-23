import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/core';
import {
  PaymentRequestConfirmation,
  PaymentRequestFooter,
  PaymentRequestHeader,
} from './components';
import { MinInvalidAmountText, useAmountConvertHelper } from './helper';
import { useDimensions } from '@rainbow-me/hooks';
import {
  Button,
  Container,
  CURRENCY_DISPLAY_MODE,
  InputAmount,
  Sheet,
  Text,
  Touchable,
} from '@cardstack/components';
import { MerchantInformation } from '@cardstack/types';
import { hitSlop } from '@cardstack/utils/layouts';
import { useNavigation } from '@rainbow-me/navigation';
import {
  usePaymentCurrencyAndConversionRates,
  useNativeCurrencyAndConversionRates,
} from '@rainbow-me/redux/hooks';
import { RouteType } from '@cardstack/navigation/types';

const TOP_POSITION = 150;

interface Params {
  address: string;
  merchantInfo: MerchantInformation;
}

const PaymentRequestExpandedSheet = () => {
  const {
    params: { address, merchantInfo },
  } = useRoute<RouteType<Params>>();

  const { setOptions } = useNavigation();
  const { height: deviceHeight, isTallPhone } = useDimensions();
  const [inputValue, setInputValue] = useState<string>();
  const [editMode, setEditMode] = useState<boolean>(true);

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = usePaymentCurrencyAndConversionRates();

  const [accountNativeCurrency] = useNativeCurrencyAndConversionRates();

  const onSkip = () => {
    setInputValue('');
    setEditMode(false);
  };

  useEffect(() => {
    setOptions({
      longFormHeight: isTallPhone ? deviceHeight - TOP_POSITION : deviceHeight,
    });
  }, [setOptions, deviceHeight, isTallPhone]);

  const {
    amountInNum,
    amountWithSymbol,
    isInvalid,
    canSubmit,
  } = useAmountConvertHelper(
    inputValue,
    nativeCurrency,
    accountNativeCurrency,
    currencyConversionRates
  );

  const EditFooter = () => (
    <Container padding={5}>
      <Button
        disabled={!canSubmit}
        onPress={() => setEditMode(false)}
        variant={!inputValue ? 'disabledBlack' : undefined}
      >{`${!inputValue ? 'Enter' : 'Confirm'} Amount`}</Button>
      <Container alignItems="center" justifyContent="center" marginTop={4}>
        <Touchable hitSlop={hitSlop.small} onPress={onSkip}>
          <Text color="blackEerie" weight="bold" size="xs">
            Skip Amount
          </Text>
        </Touchable>
      </Container>
    </Container>
  );

  return (
    <Sheet
      isFullScreen
      scrollEnabled={!editMode}
      Header={<PaymentRequestHeader />}
      Footer={editMode ? <EditFooter /> : <PaymentRequestFooter />}
    >
      {editMode ? (
        <Container paddingHorizontal={5}>
          <InputAmount
            borderBottomColor="black"
            borderBottomWidth={1}
            currencyDisplayMode={CURRENCY_DISPLAY_MODE.LABEL}
            flex={1}
            inputValue={inputValue}
            marginBottom={2}
            marginTop={8}
            nativeCurrency={nativeCurrency}
            paddingBottom={1}
            setInputValue={setInputValue}
            isInvalid={isInvalid}
          />
          {isInvalid ? (
            <MinInvalidAmountText
              nativeCurrency={nativeCurrency}
              currencyConversionRates={currencyConversionRates}
            />
          ) : null}
        </Container>
      ) : (
        <>
          {amountInNum > 0 ? (
            <>
              <Container
                flex={1}
                flexDirection="row"
                justifyContent="space-between"
                marginTop={!editMode ? 9 : 15}
                paddingHorizontal={5}
              >
                <Container
                  flex={4}
                  alignItems="flex-start"
                  justifyContent="center"
                >
                  <Text>
                    <Text weight="bold">{merchantInfo?.name}</Text> requests{' '}
                    <Text weight="bold">{amountWithSymbol}</Text>
                  </Text>
                </Container>
                <Container
                  flex={1}
                  alignItems="flex-end"
                  justifyContent="center"
                >
                  <Touchable
                    borderColor="grayText"
                    borderRadius={15}
                    borderWidth={1}
                    height={30}
                    hitSlop={hitSlop.small}
                    onPress={() => setEditMode(true)}
                    paddingHorizontal={4}
                  >
                    <Text fontSize={11} weight="bold" lineHeight={26}>
                      Edit
                    </Text>
                  </Touchable>
                </Container>
              </Container>
              <Container
                borderBottomColor="backgroundLightGray"
                borderBottomWidth={1}
                marginHorizontal={5}
                paddingBottom={4}
              />
            </>
          ) : null}
          <PaymentRequestConfirmation
            address={address}
            amountInNum={amountInNum}
            nativeCurrency={nativeCurrency}
            amountWithSymbol={amountWithSymbol}
            merchantInfo={merchantInfo}
          />
        </>
      )}
    </Sheet>
  );
};

export default PaymentRequestExpandedSheet;
