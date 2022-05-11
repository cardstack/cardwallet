import { useRoute } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  CURRENCY_DISPLAY_MODE,
  InputAmount,
  Sheet,
  Text,
  Touchable,
  useInputAmountHelper,
} from '@cardstack/components';
import { useBooleanState } from '@cardstack/hooks';
import { RouteType } from '@cardstack/navigation/types';
import { MerchantInformation } from '@cardstack/types';
import { hitSlop } from '@cardstack/utils/layouts';

import {
  PaymentRequestConfirmation,
  PaymentRequestFooter,
  PaymentRequestHeader,
} from './components';

interface Params {
  address: string;
  merchantInfo: MerchantInformation;
}

const PaymentRequestExpandedSheet = () => {
  const {
    params: { address, merchantInfo },
  } = useRoute<RouteType<Params>>();

  const [editMode, enableEdit, disableEdit] = useBooleanState(true);

  const {
    amountInNum,
    amountWithSymbol,
    isInvalid,
    canSubmit,
    paymentCurrency,
    setPaymentCurrency,
    inputValue,
    setInputValue,
  } = useInputAmountHelper();

  const onSkip = useCallback(() => {
    setInputValue('');
    disableEdit();
  }, [disableEdit, setInputValue]);

  return (
    <Sheet
      isFullScreen
      scrollEnabled={!editMode}
      Header={<PaymentRequestHeader />}
      Footer={!editMode ? <PaymentRequestFooter /> : undefined}
    >
      {editMode ? (
        <Container
          paddingHorizontal={5}
          justifyContent="space-between"
          flex={1}
        >
          <InputAmount
            borderBottomColor="black"
            borderBottomWidth={1}
            currencyDisplayMode={CURRENCY_DISPLAY_MODE.LABEL}
            inputValue={inputValue}
            marginBottom={2}
            marginTop={8}
            onCurrencyChange={setPaymentCurrency}
            selectedCurrency={paymentCurrency}
            paddingBottom={1}
            setInputValue={setInputValue}
            isInvalid={isInvalid}
          />
          <CenteredContainer>
            <Button
              disabled={!canSubmit}
              onPress={disableEdit}
              variant={isInvalid ? 'disabledBlack' : undefined}
            >{`${!inputValue ? 'Enter' : 'Confirm'} Amount`}</Button>
            <Touchable hitSlop={hitSlop.small} onPress={onSkip} paddingTop={2}>
              <Text color="blackEerie" weight="bold" size="xs">
                Skip Amount
              </Text>
            </Touchable>
          </CenteredContainer>
        </Container>
      ) : (
        <>
          {amountInNum > 0 ? (
            <>
              <Container
                flex={1}
                flexDirection="row"
                justifyContent="flex-end"
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
                    onPress={enableEdit}
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
          ) : (
            <Text weight="bold" textAlign="center" marginTop={3}>
              {merchantInfo?.name || ''}
            </Text>
          )}
          <PaymentRequestConfirmation
            address={address}
            amountInNum={amountInNum}
            paymentCurrency={paymentCurrency}
            amountWithSymbol={amountWithSymbol}
            merchantInfo={merchantInfo}
          />
        </>
      )}
    </Sheet>
  );
};

export default memo(PaymentRequestExpandedSheet);
