import {
  convertAmountFromNativeValue,
  formatInputDecimals,
} from '@cardstack/cardpay-sdk';
import { useRoute, useNavigation } from '@react-navigation/native';
import { captureException } from '@sentry/react-native';
import BN from 'bn.js';
import { isEmpty, isString } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Web3 from 'web3';

import { SEND_TRANSACTION_ERROR_MESSAGE } from '@cardstack/constants';
import { useBooleanState } from '@cardstack/hooks';
import { getSafesInstance } from '@cardstack/models/safes-providers';
import { useLoadingOverlay, Routes, Navigation } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { useGetSafesDataQuery } from '@cardstack/services';
import {
  getUsdConverter,
  getValueInNativeCurrency,
} from '@cardstack/services/exchange-rate-service';
import { DepotAsset, TokenType } from '@cardstack/types';
import {
  reshapeDepotTokensToAssets,
  reshapeSingleDepotTokenToAsset,
} from '@cardstack/utils/depot-utils';
import { useWorker } from '@cardstack/utils/hooks-utilities';

import { Alert } from '@rainbow-me/components/alerts';
import { useSendAddressValidation } from '@rainbow-me/components/send/SendSheet';
import { useAccountSettings } from '@rainbow-me/hooks';
import logger from 'logger';

interface Params {
  asset: TokenType;
  safeAddress?: string;
}

const amountDetailsInitialState = {
  assetAmount: '',
  isSufficientBalance: false,
  nativeAmount: '',
};

export const useSendSheetDepotScreen = () => {
  const usdConverter = useRef<undefined | ((amountInWei: string) => number)>();
  const { navigate } = useNavigation();
  const { params } = useRoute<RouteType<Params>>();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const { accountAddress, network, nativeCurrency } = useAccountSettings();

  const {
    depots: [depot],
  } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      selectFromResult: ({ data }) => ({
        depots: data?.depots || [],
      }),
    }
  );

  const reshapedAsset = useMemo(
    () =>
      params?.asset?.tokenAddress
        ? reshapeSingleDepotTokenToAsset(params?.asset)
        : undefined,
    [params.asset]
  );

  const [selected, setSelected] = useState<DepotAsset | undefined>(
    reshapedAsset
  );

  const [
    sendFullBalance,
    enableFullBalanceSend,
    disableFullBalanceSend,
  ] = useBooleanState();

  // If there's safeAddress, for now it means it's from a merchant,
  // so we only show one asset in the assets list, which is the one
  // that started the send flow
  const depotAssets = useMemo(
    () =>
      depot && !params?.safeAddress
        ? reshapeDepotTokensToAssets(depot)
        : [reshapedAsset],
    [depot, params.safeAddress, reshapedAsset]
  );

  const safeAddress = params?.safeAddress || depot?.address;

  // Inputs
  const recipientFieldRef = useRef();
  const [recipient, setRecipient] = useState('');

  const [amountDetails, setAmountDetails] = useState(amountDetailsInitialState);

  const [maxInputBalance, updateMaxInputBalance] = useState('');

  const isValidAddress = useSendAddressValidation(recipient);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const getNativeCurrencyAmount = useCallback(
    async (amount: string) => {
      const usdConvertedAmount = usdConverter.current?.(amount) || 0;

      return await getValueInNativeCurrency(
        usdConvertedAmount,
        nativeCurrency,
        false
      );
    },
    [nativeCurrency]
  );

  // Gas Estimates
  const [gasEstimatedFee, setGasEstimatedFee] = useState({
    amount: 0,
    nativeDisplay: `0 ${selected?.symbol || ''}`,
  });

  const getGasPriceEstimate = useCallback(async () => {
    try {
      const amountWei = Web3.utils.toWei(amountDetails.assetAmount || '0');

      const safes = await getSafesInstance();

      const gasEstimate =
        (await safes?.sendTokensGasEstimate(
          safeAddress,
          selected?.address || '',
          recipient || safeAddress, // Fallback to a valid recipient to get gasEstimation on first render
          amountWei
        )) || '0';

      const nativeCurrencyGasFee =
        (await getNativeCurrencyAmount(gasEstimate)) || 0;

      setGasEstimatedFee({
        amount: nativeCurrencyGasFee,
        nativeDisplay: `${Web3.utils.fromWei(gasEstimate)} ${
          selected?.symbol || ''
        }`,
      });

      // Calculate maxBalance
      const currentBalanceWei = new BN(selected?.balance?.wei || '0');

      const gasEstimateWei = new BN(gasEstimate);

      const isNotEnoughBalance = gasEstimateWei.gte(currentBalanceWei);

      const maxBalanceWei = isNotEnoughBalance
        ? new BN(0)
        : currentBalanceWei.sub(gasEstimateWei);

      const maxBalanceEth = Web3.utils.fromWei(maxBalanceWei, 'ether');

      updateMaxInputBalance(maxBalanceEth);

      const isSufficientBalance =
        Number(amountDetails.assetAmount) <= Number(maxBalanceEth);

      if (isSufficientBalance !== amountDetails.isSufficientBalance) {
        setAmountDetails(oldAmountDetails => ({
          ...oldAmountDetails,
          isSufficientBalance,
        }));
      }
    } catch (e) {
      logger.error('Error getting gasPriceEstimate or maxBalance', e);
    }
  }, [
    amountDetails.assetAmount,
    amountDetails.isSufficientBalance,
    getNativeCurrencyAmount,
    recipient,
    safeAddress,
    selected,
  ]);

  // Update gasFee initial render and when asset changes
  useEffect(() => {
    if (!gasEstimatedFee.amount && !isEmpty(selected)) {
      getGasPriceEstimate();
    }
  }, [gasEstimatedFee.amount, getGasPriceEstimate, selected]);

  const {
    callback: getTokenToUsdConverter,
    error: getConverterError,
  } = useWorker(async () => {
    if (selected?.symbol) {
      usdConverter.current = await getUsdConverter(selected?.symbol);
    }
  }, [selected]);

  useEffect(() => {
    if (getConverterError) {
      captureException(getConverterError);
      Navigation.handleAction(Routes.ERROR_FALLBACK_SCREEN, {}, true);
    }
  }, [getConverterError]);

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
      const assetAmount: string = newAssetAmount.replace(/[^0-9.]/g, '');
      const hasAmount = !!assetAmount.length;

      const nativeCurrencyAssetAmount = hasAmount
        ? await getNativeCurrencyAmount(Web3.utils.toWei(assetAmount))
        : 0;

      try {
        const nativeAmount = hasAmount
          ? nativeCurrencyAssetAmount.toString()
          : '';

        handleAmountDetails({
          assetAmount,
          nativeAmount,
        });
      } catch (e) {
        logger.error('Failed to convert token amount to usd', e);
      }
    },
    [getNativeCurrencyAmount, handleAmountDetails]
  );

  const onChangeNativeAmount = useCallback(
    async newNativeAmount => {
      if (!isString(newNativeAmount)) return;

      disableFullBalanceSend();

      const nativeAmount = newNativeAmount.replace(/[^0-9.]/g, '');

      if (!nativeAmount.length) {
        setAmountDetails(amountDetailsInitialState);

        return;
      }

      try {
        // Getting how much one token is worth in order to calculate currencyToToken
        const nativeCurrencyPriceUnit = await getNativeCurrencyAmount(
          Web3.utils.toWei('1')
        );

        const convertedAssetAmount = convertAmountFromNativeValue(
          nativeAmount,
          nativeCurrencyPriceUnit,
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
    [
      getNativeCurrencyAmount,
      handleAmountDetails,
      selected,
      disableFullBalanceSend,
    ]
  );

  const onMaxBalancePress = useCallback(async () => {
    enableFullBalanceSend();
    updateAssetAmount(maxInputBalance);
  }, [updateAssetAmount, maxInputBalance, enableFullBalanceSend]);

  const onChangeAssetAmount = useCallback(
    newAssetAmount => {
      if (isString(newAssetAmount)) {
        disableFullBalanceSend();
        updateAssetAmount(newAssetAmount);
      }
    },
    [updateAssetAmount, disableFullBalanceSend]
  );

  // Reset all values
  const onResetAssetSelection = useCallback(() => {
    setSelected(undefined);
    setAmountDetails(amountDetailsInitialState);
    setGasEstimatedFee({
      amount: 0,
      nativeDisplay: '',
    });

    updateMaxInputBalance('');
    usdConverter.current = undefined;
  }, []);

  // Send tokens

  const sendTokenFromDepot = useCallback(async () => {
    try {
      const safes = await getSafesInstance({ accountAddress });

      const customAmount = Web3.utils.toWei(amountDetails.assetAmount);
      const fullAmount = undefined; // When no amount is passed, the whole available balance is send;

      const amountInWei = sendFullBalance ? fullAmount : customAmount;

      return safes?.sendTokens(
        safeAddress,
        selected?.address || '',
        recipient,
        amountInWei,
        undefined,
        { from: accountAddress }
      );
    } catch (error) {
      logger.sentry('Error sending tokens', {
        error,
        args: {
          safeAddress,
          recipient,
          sendFullBalance,
          customAmount: Web3.utils.toWei(amountDetails.assetAmount),
          accountAddress,
          token: selected?.address,
        },
      });
    }
  }, [
    accountAddress,
    amountDetails.assetAmount,
    recipient,
    safeAddress,
    selected,
    sendFullBalance,
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
    showLoadingOverlay({ title: 'Sending...' });

    try {
      await sendTokenFromDepot();

      navigate(Routes.WALLET_SCREEN, { forceRefreshOnce: true });
    } catch (error) {
      dismissLoadingOverlay();
      const errorMessage = (error as any).toString();

      if (errorMessage) {
        Alert({
          message: errorMessage,
          title: SEND_TRANSACTION_ERROR_MESSAGE,
        });
      } else {
        Alert({ title: SEND_TRANSACTION_ERROR_MESSAGE });
      }

      logger.sentry('TX Details', error);
      captureException(error);
    } finally {
      setIsAuthorizing(false);
    }
  }, [
    canSubmit,
    dismissLoadingOverlay,
    navigate,
    sendTokenFromDepot,
    showLoadingOverlay,
  ]);

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
      setRecipient,
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
    ]
  );
};
