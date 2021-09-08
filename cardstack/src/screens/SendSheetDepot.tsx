import {
  convertAmountFromNativeValue,
  formatInputDecimals,
} from '@cardstack/cardpay-sdk';
import { useRoute } from '@react-navigation/native';
import { captureException } from '@sentry/react-native';
import BigNumber from 'bignumber.js';
import { get, isEmpty, isString } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Web3 from 'web3';
import SendSheet, {
  useSendAddressValidation,
} from '../../../src/components/send/SendSheet';
import { getSafesInstance } from '../models';
import { Alert } from '../../../src/components/alerts';
import { toWei } from '@rainbow-me/handlers/web3';
import { useNavigation } from '@rainbow-me/navigation/Navigation';
import {
  reshapeDepotTokensToAssets,
  reshapeSingleDepotTokenToAsset,
} from '@cardstack/utils';
import {
  useAccountAssets,
  useAccountSettings,
  useMagicAutofocus,
  useWallets,
} from '@rainbow-me/hooks';
import Routes from '@rainbow-me/routes';
import logger from 'logger';
import { DepotAsset, TokenType } from '@cardstack/types';
import { getUsdConverter } from '@cardstack/services';

interface RouteType {
  params: { asset: TokenType };
  key: string;
  name: string;
}

const amountDetailsInitialState = {
  assetAmount: '',
  isSufficientBalance: false,
  nativeAmount: '',
};

export const useSendSheetDepotScreen = () => {
  const usdConverter = useRef<undefined | ((amountInWei: string) => number)>();
  const { navigate } = useNavigation();
  const { params } = useRoute<RouteType>();

  // Assets
  const {
    depots: [depot],
  } = useAccountAssets();

  const depotAssets = useMemo(
    () => (depot ? reshapeDepotTokensToAssets(depot) : []),
    [depot]
  );

  const [selected, setSelected] = useState<DepotAsset | undefined>(
    reshapeSingleDepotTokenToAsset(params?.asset)
  );

  // Inputs
  const recipientFieldRef = useRef();
  const [recipient, setRecipient] = useState('');
  const { handleFocus, triggerFocus } = useMagicAutofocus(recipientFieldRef);

  const [amountDetails, setAmountDetails] = useState(amountDetailsInitialState);

  const [maxInputBalance, updateMaxInputBalance] = useState('');

  const isValidAddress = useSendAddressValidation(recipient);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const { accountAddress, nativeCurrency, network } = useAccountSettings();

  // Gas Estimates
  const [gasEstimatedFee, setGasEstimatedFee] = useState(0);

  const getGasPriceEstimate = useCallback(async () => {
    try {
      const amountWei = Web3.utils.toWei(amountDetails.assetAmount || '0');

      const safes = await getSafesInstance();

      const gasEstimate =
        (await safes?.sendTokensGasEstimate(
          depot.address,
          selected?.address || '',
          recipient || depot.address, // Fallback to a valid recipient to get gasEstimation on first render
          amountWei
        )) || '0';

      const gasFeeInUsd = usdConverter.current?.(gasEstimate) || 0;

      setGasEstimatedFee(gasFeeInUsd);

      // Calculate maxBalance
      const currentBalanceWei = new BigNumber(selected?.balance?.wei || '0');
      const gasEstimateWei = new BigNumber(gasEstimate);

      const isNotEnoughBalance = gasEstimateWei.isGreaterThanOrEqualTo(
        currentBalanceWei
      );

      const maxBalanceWei = isNotEnoughBalance
        ? 0
        : currentBalanceWei.minus(gasEstimateWei);

      const maxBalanceEth = Web3.utils.fromWei(maxBalanceWei.toString());

      updateMaxInputBalance(maxBalanceEth);
    } catch (e) {
      logger.error('Error getting gasPriceEstimate or maxBalance', e);
    }
  }, [amountDetails.assetAmount, depot.address, recipient, selected]);

  // Update gasFee initial render and when asset changes
  useEffect(() => {
    if (!gasEstimatedFee && !isEmpty(selected)) {
      getGasPriceEstimate();
    }
  }, [gasEstimatedFee, getGasPriceEstimate, selected]);

  const getTokenToUsdConverter = useCallback(async () => {
    if (selected?.symbol) {
      usdConverter.current = await getUsdConverter(selected?.symbol);
    }
  }, [selected]);

  // Update converter on initial render and on reseting asset selection
  useEffect(() => {
    if (!usdConverter.current && selected?.symbol) {
      getTokenToUsdConverter();
    }
  }, [getTokenToUsdConverter, selected]);

  const handleAmountDetails = useCallback(
    ({ assetAmount, nativeAmount }) => {
      const isSufficientBalance =
        Number(assetAmount) <= Number(maxInputBalance);

      setAmountDetails({
        assetAmount,
        isSufficientBalance,
        nativeAmount,
      });
    },
    [maxInputBalance]
  );

  const updateAssetAmount = useCallback(
    async newAssetAmount => {
      const assetAmount = newAssetAmount.replace(/[^0-9.]/g, '');

      try {
        const nativeAmount = assetAmount.length
          ? usdConverter.current?.(toWei(assetAmount)).toString()
          : '';

        handleAmountDetails({
          assetAmount,
          nativeAmount,
        });
      } catch (e) {
        logger.error('Failed to convert token amount to usd', e);
      }
    },
    [handleAmountDetails]
  );

  const onChangeNativeAmount = useCallback(
    newNativeAmount => {
      if (!isString(newNativeAmount)) return;
      const nativeAmount = newNativeAmount.replace(/[^0-9.]/g, '');

      if (!nativeAmount.length) {
        setAmountDetails(amountDetailsInitialState);

        return;
      }

      try {
        // Getting how much on token is worth in usd in order to calculate usdToTokenValue
        const usdPriceUnit =
          usdConverter.current?.(toWei('1')).toString() ||
          get(selected, 'price.value', 0);

        const convertedAssetAmount = convertAmountFromNativeValue(
          nativeAmount,
          usdPriceUnit,
          selected?.decimals
        );

        const assetAmount = formatInputDecimals(
          convertedAssetAmount,
          nativeAmount
        );

        handleAmountDetails({
          assetAmount: assetAmount || '',
          nativeAmount,
        });
      } catch (e) {
        logger.error('Failed to use usdConverter', e);
      }
    },
    [handleAmountDetails, selected]
  );

  const onMaxBalancePress = useCallback(async () => {
    updateAssetAmount(maxInputBalance);
  }, [updateAssetAmount, maxInputBalance]);

  const onChangeAssetAmount = useCallback(
    newAssetAmount => {
      if (isString(newAssetAmount)) {
        updateAssetAmount(newAssetAmount);
      }
    },
    [updateAssetAmount]
  );

  // Reset all values
  const onResetAssetSelection = useCallback(() => {
    setSelected(undefined);
    setAmountDetails(amountDetailsInitialState);
    setGasEstimatedFee(0);
    updateMaxInputBalance('');
    usdConverter.current = undefined;
  }, []);

  // Send tokens
  const { selectedWallet } = useWallets();

  const sendTokenFromDepot = useCallback(async () => {
    const safes = await getSafesInstance({ selectedWallet, network });

    const amountInWei = Web3.utils.toWei(amountDetails.assetAmount);

    return safes?.sendTokens(
      depot.address,
      selected?.address || '',
      recipient,
      amountInWei,
      undefined,
      { from: accountAddress }
    );
  }, [
    accountAddress,
    amountDetails.assetAmount,
    depot.address,
    network,
    recipient,
    selected,
    selectedWallet,
  ]);

  const canSubmit = useMemo(() => {
    const validAmount = Number(amountDetails.assetAmount) > 0;

    const validTransaction =
      isValidAddress && amountDetails.isSufficientBalance;

    return validTransaction && validAmount;
  }, [amountDetails, isValidAddress]);

  const onSendPress = useCallback(async () => {
    setIsAuthorizing(true);
    if (!canSubmit) return;

    try {
      await sendTokenFromDepot();

      navigate(Routes.PROFILE_SCREEN);
    } catch (error) {
      const errorMessage = error.toString();

      if (errorMessage) {
        Alert({
          message: errorMessage,
          title: 'An error ocurred',
        });
      }

      logger.sentry('TX Details', error);
      captureException(error);
    } finally {
      setIsAuthorizing(false);
    }
  }, [canSubmit, navigate, sendTokenFromDepot]);

  return useMemo(
    () => ({
      isValidAddress,
      recipient,
      recipientFieldRef,
      nativeCurrency,
      network,
      selected,
      amountDetails,
      isAuthorizing,
      handleFocus,
      setRecipient,
      triggerFocus,
      onSendPress,
      onChangeAssetAmount,
      onChangeNativeAmount,
      onResetAssetSelection,
      onMaxBalancePress,
      onSelectAsset: setSelected,
      allAssets: depotAssets,
      selectedGasPrice: gasEstimatedFee,
      isSufficientGas: true,
    }),
    [
      amountDetails,
      depotAssets,
      gasEstimatedFee,
      handleFocus,
      isAuthorizing,
      isValidAddress,
      nativeCurrency,
      network,
      onChangeAssetAmount,
      onChangeNativeAmount,
      onMaxBalancePress,
      onResetAssetSelection,
      onSendPress,
      recipient,
      selected,
      triggerFocus,
    ]
  );
};

const SendSheetDepot = () => {
  const hookProps = useSendSheetDepotScreen();

  return <SendSheet {...hookProps} />;
};

export default SendSheetDepot;
