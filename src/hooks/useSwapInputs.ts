import {
  convertAmountFromNativeValue,
  convertAmountToNativeAmount,
  greaterThanOrEqualTo,
  isZero,
  updatePrecisionToDisplay,
} from '@cardstack/cardpay-sdk';
import { get } from 'lodash';
import { RefObject, useCallback } from 'react';
import { TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import useSwapInputOutputTokens from './useSwapInputOutputTokens';
import {
  updateIsMax,
  updateIsSufficientBalance,
  updateSwapInputAmount,
  updateSwapNativeAmount,
  updateSwapOutputAmount,
} from '@rainbow-me/redux/swap';
import logger from 'logger';

export default function useSwapInputs({
  isWithdrawal,
  maxInputBalance,
  nativeFieldRef,
  supplyBalanceUnderlying,
}: {
  isWithdrawal: boolean;
  maxInputBalance: string;
  nativeFieldRef: RefObject<TextInput>;
  supplyBalanceUnderlying: string;
}) {
  const dispatch = useDispatch();
  const { inputCurrency } = useSwapInputOutputTokens();

  const updateInputAmount = useCallback(
    (
      newInputAmount,
      newAmountDisplay,
      newInputAsExactAmount = true,
      newIsMax = false
    ) => {
      const display = newAmountDisplay || newInputAmount;
      dispatch(
        updateSwapInputAmount(newInputAmount, display, newInputAsExactAmount)
      );
      dispatch(updateIsMax(!!newInputAmount && newIsMax));

      if (!nativeFieldRef?.current?.isFocused() || newIsMax) {
        let newNativeAmount = null;

        const isInputZero = isZero(newInputAmount);

        if (newInputAmount && !isInputZero) {
          const newNativePrice = get(
            inputCurrency,
            'native.price.amount',
            null
          );
          newNativeAmount = convertAmountToNativeAmount(
            newInputAmount,
            newNativePrice
          );
        }
        dispatch(updateSwapNativeAmount(newNativeAmount));

        if (inputCurrency) {
          const newIsSufficientBalance =
            !newInputAmount ||
            (isWithdrawal
              ? greaterThanOrEqualTo(supplyBalanceUnderlying, newInputAmount)
              : greaterThanOrEqualTo(maxInputBalance, newInputAmount));

          dispatch(updateIsSufficientBalance(newIsSufficientBalance));
        }
      }
    },
    [
      dispatch,
      inputCurrency,
      isWithdrawal,
      maxInputBalance,
      nativeFieldRef,
      supplyBalanceUnderlying,
    ]
  );

  const updateNativeAmount = useCallback(
    nativeAmount => {
      logger.log('update native amount', nativeAmount);

      if (!inputCurrency) return;

      let inputAmount = null;
      let inputAmountDisplay = null;

      const isNativeZero = isZero(nativeAmount);
      dispatch(updateSwapNativeAmount(nativeAmount));

      dispatch(updateIsMax(false));

      if (nativeAmount && !isNativeZero) {
        const nativePrice = get(inputCurrency, 'native.price.amount', null);
        inputAmount = convertAmountFromNativeValue(
          nativeAmount,
          nativePrice,
          inputCurrency.decimals
        );
        inputAmountDisplay = updatePrecisionToDisplay(
          inputAmount,
          nativePrice,
          true
        );
      }

      dispatch(updateSwapInputAmount(inputAmount, inputAmountDisplay, true));
    },
    [dispatch, inputCurrency]
  );

  const updateOutputAmount = useCallback(
    (newOutputAmount, newAmountDisplay, newInputAsExactAmount = false) => {
      const display = newAmountDisplay || newOutputAmount;
      dispatch(
        updateSwapOutputAmount(newOutputAmount, display, newInputAsExactAmount)
      );
    },
    [dispatch]
  );

  return {
    updateInputAmount,
    updateNativeAmount,
    updateOutputAmount,
  };
}
