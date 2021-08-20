import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useRoute } from '@react-navigation/core';
import analytics from '@segment/analytics-react-native';
import { isEmpty } from 'lodash';
import React, { useCallback, useState } from 'react';
import { Clock } from 'react-native-reanimated';

import {
  useAccountSettings,
  useDimensions,
  useIsWalletEthZero,
} from '../../hooks';
import { Alert } from '../alerts';
import { runSpring } from '../animations';

import { Numpad, NumpadValue } from '../numpad';
import AddCashFooter from './AddCashFooter';
import AddCashSelector from './AddCashSelector';
import { CenteredContainer } from '@cardstack/components';
import {
  DAI_ADDRESS,
  ETH_ADDRESS_SYMBOL,
} from '@rainbow-me/references/addresses';

const currencies = [DAI_ADDRESS, ETH_ADDRESS_SYMBOL];
const minimumPurchaseAmountUSD = 1;

const AddCashForm = ({
  limitWeekly,
  onClearError,
  onLimitExceeded,
  onPurchase,
  onShake,
  shakeAnim,
}) => {
  const isWalletEthZero = useIsWalletEthZero();
  const { params } = useRoute();
  const [paymentSheetVisible, setPaymentSheetVisible] = useState(false);
  const { network } = useAccountSettings();

  const { isTallPhone } = useDimensions();
  const [scaleAnim, setScaleAnim] = useState(1);

  const initialCurrencyIndex = isWalletEthZero ? 1 : 0;
  const [currency, setCurrency] = useState(currencies[initialCurrencyIndex]);
  const [value, setValue] = useState(
    params?.params?.amount ? params?.params?.amount?.toString() : ''
  );

  const handlePurchase = useCallback(async () => {
    if (paymentSheetVisible) return;
    try {
      analytics.track('Submitted Purchase', {
        category: 'add cash',
        label: currency,
        value: Number(value),
      });
      setPaymentSheetVisible(true);
      await onPurchase({ address: currency, value });
      // eslint-disable-next-line no-empty
    } catch (e) {
    } finally {
      setPaymentSheetVisible(false);
    }
  }, [currency, onPurchase, paymentSheetVisible, value]);

  const handleNumpadPress = useCallback(
    newValue => {
      setValue(prevValue => {
        const isExceedingWeeklyLimit =
          parseFloat(prevValue + parseFloat(newValue)) > limitWeekly;

        const isInvalidFirstEntry =
          !prevValue &&
          (newValue === '0' || newValue === '.' || newValue === 'back');

        const isMaxDecimalCount =
          prevValue && prevValue.includes('.') && newValue === '.';

        const isMaxDecimalLength =
          prevValue &&
          prevValue.charAt(prevValue.length - 3) === '.' &&
          newValue !== 'back';

        if (
          isExceedingWeeklyLimit ||
          isInvalidFirstEntry ||
          isMaxDecimalCount ||
          isMaxDecimalLength
        ) {
          if (isExceedingWeeklyLimit) onLimitExceeded('weekly');
          onShake();
          return prevValue;
        }

        let nextValue = prevValue;
        if (nextValue === null) {
          nextValue = newValue;
        } else if (newValue === 'back') {
          nextValue = prevValue.slice(0, -1);
        } else {
          nextValue += newValue;
        }

        onClearError();

        let prevPosition = 1;
        if (prevValue && prevValue.length > 3) {
          prevPosition = 1 - (prevValue.length - 3) * 0.075;
        }
        if (nextValue.length > 3) {
          const characterCount = 1 - (nextValue.length - 3) * 0.075;
          setScaleAnim(
            runSpring(new Clock(), prevPosition, characterCount, 0, 400, 40)
          );
        } else if (nextValue.length === 3) {
          setScaleAnim(runSpring(new Clock(), prevPosition, 1, 0, 400, 40));
        }

        return nextValue;
      });

      analytics.track('Updated cash amount', {
        category: 'add cash',
      });
    },
    [limitWeekly, onClearError, onLimitExceeded, onShake]
  );

  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  const onCurrencyChange = useCallback(
    val => {
      if (isWalletEthZero) {
        Alert({
          buttons: [{ text: 'Okay' }],
          message: `Before you can purchase DAI you must have some ${nativeTokenSymbol} in your wallet!`,
          title: `You don't have any ${nativeTokenSymbol}!`,
        });
        analytics.track(
          `Tried to purchase DAI but doesnt own any ${nativeTokenSymbol}`,
          {
            category: 'add cash',
            label: val,
          }
        );
      } else {
        setCurrency(val);
        analytics.track('Switched currency to purchase', {
          category: 'add cash',
          label: val,
        });
      }
    },
    [isWalletEthZero, nativeTokenSymbol]
  );

  return (
    <>
      <CenteredContainer flex={1}>
        <CenteredContainer>
          <NumpadValue scale={scaleAnim} translateX={shakeAnim} value={value} />
          <CenteredContainer>
            <AddCashSelector
              currencies={currencies}
              initialCurrencyIndex={initialCurrencyIndex}
              isWalletEthZero={isWalletEthZero}
              onSelect={onCurrencyChange}
            />
            {/* <SmallPrepaidCard
              id="0xbeA3123457eF8"
              spendableBalance={Number(value) * 100}
            /> */}
          </CenteredContainer>
        </CenteredContainer>
      </CenteredContainer>
      <CenteredContainer margin={isTallPhone ? 8 : 3} marginBottom={0}>
        <CenteredContainer>
          <Numpad onPress={handleNumpadPress} />
        </CenteredContainer>
        <AddCashFooter
          disabled={
            isEmpty(value) || parseFloat(value) < minimumPurchaseAmountUSD
          }
          onDisabledPress={onShake}
          onSubmit={handlePurchase}
        />
      </CenteredContainer>
    </>
  );
};

export default React.memo(AddCashForm);
