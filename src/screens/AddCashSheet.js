import React, { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { AddCashForm, AddCashStatus } from '../components/add-cash';
import { BackButton } from '../components/header';
import {
  SheetHandle,
  SheetSubtitleCycler,
  SheetTitle,
} from '../components/sheet';
import { useTheme } from '../context/ThemeContext';
import isNativeStackAvailable from '../helpers/isNativeStackAvailable';
import {
  useAddCashLimits,
  useShakeAnimation,
  useTimeout,
  useWyreApplePay,
} from '../hooks';
import { deviceUtils } from '../utils';
import { CenteredContainer, Container } from '@cardstack/components';
import { useNavigation } from '@rainbow-me/navigation';

const deviceHeight = deviceUtils.dimensions.height;
const statusBarHeight = getStatusBarHeight(true);
const sheetHeight =
  deviceHeight -
  statusBarHeight -
  (isNativeStackAvailable ? (deviceHeight >= 812 ? 10 : 20) : 0);

const SubtitleInterval = 3000;

export default function AddCashSheet() {
  const { colors } = useTheme();
  const { goBack } = useNavigation();

  const [errorAnimation, onShake] = useShakeAnimation();
  const [startErrorTimeout, stopErrorTimeout] = useTimeout();

  const [errorIndex, setErrorIndex] = useState(null);
  const onClearError = useCallback(() => setErrorIndex(null), []);

  const { weeklyRemainingLimit, yearlyRemainingLimit } = useAddCashLimits();

  const cashLimits = useMemo(
    () => ({
      weekly:
        weeklyRemainingLimit > 0
          ? `$${weeklyRemainingLimit} left this week`
          : 'Weekly limit reached',
      yearly:
        yearlyRemainingLimit > 0
          ? `$${yearlyRemainingLimit} left this year`
          : 'Yearly limit reached',
    }),
    [weeklyRemainingLimit, yearlyRemainingLimit]
  );

  const {
    error,
    isPaymentComplete,
    onPurchase,
    orderCurrency,
    orderStatus,
    resetAddCashForm,
    transferStatus,
  } = useWyreApplePay();

  const onLimitExceeded = useCallback(
    limit => {
      stopErrorTimeout();
      setErrorIndex(Object.keys(cashLimits).indexOf(limit));
      startErrorTimeout(() => onClearError(), SubtitleInterval);
    },
    [stopErrorTimeout, cashLimits, startErrorTimeout, onClearError]
  );

  console.log(isPaymentComplete);
  return (
    <Container
      backgroundColor="white"
      borderTopLeftRadius={isNativeStackAvailable ? 0 : 16}
      borderTopRightRadius={isNativeStackAvailable ? 0 : 16}
      colors={colors}
      height={isNativeStackAvailable ? deviceHeight : sheetHeight}
      top={isNativeStackAvailable ? 0 : statusBarHeight}
      width="100%"
    >
      <StatusBar barStyle="light-content" />
      <Container
        height={isNativeStackAvailable ? sheetHeight : '100%'}
        justifyContent="flex-end"
        paddingBottom={4}
      >
        <Container paddingVertical={2}>
          <Container alignSelf="center">
            <SheetHandle />
          </Container>
          <Container paddingTop={isNativeStackAvailable ? 4 : 1}>
            <CenteredContainer flexDirection="row">
              <Container left={0} position="absolute">
                <BackButton
                  color="blue"
                  direction="left"
                  onPress={() => goBack()}
                  testID="goToBalancesFromScanner"
                />
              </Container>
              <SheetTitle>Add Funds</SheetTitle>
            </CenteredContainer>
            {!isPaymentComplete && (
              <SheetSubtitleCycler
                animatedValue={errorAnimation}
                errorIndex={errorIndex}
                interval={SubtitleInterval}
                items={Object.values(cashLimits)}
                paddingVertical={2}
              />
            )}
          </Container>
        </Container>

        <CenteredContainer flex={1} width="100%">
          {isPaymentComplete ? (
            <AddCashStatus
              error={error}
              orderCurrency={orderCurrency}
              orderStatus={orderStatus}
              resetAddCashForm={resetAddCashForm}
              transferStatus={transferStatus}
            />
          ) : (
            <AddCashForm
              limitWeekly={weeklyRemainingLimit}
              onClearError={onClearError}
              onLimitExceeded={onLimitExceeded}
              onPurchase={onPurchase}
              onShake={onShake}
              shakeAnim={errorAnimation}
            />
          )}
        </CenteredContainer>
      </Container>
    </Container>
  );
}
