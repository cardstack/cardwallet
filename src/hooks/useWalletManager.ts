import { captureException } from '@sentry/react-native';
import { isNil } from 'lodash';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  CreateImportParams,
  createOrImportWallet,
  loadAddress,
} from '../model/wallet';
import {
  settingsLoadNetwork,
  settingsUpdateAccountAddress,
} from '../redux/settings';
import {
  addressSetSelected,
  walletsLoadState,
  walletsSetSelected,
} from '../redux/wallets';
import useAccountSettings from './useAccountSettings';
import useInitializeAccountData from './useInitializeAccountData';
import useLoadAccountData from './useLoadAccountData';
import useLoadCoingeckoCoins from './useLoadCoingeckoCoins';
import useLoadGlobalData from './useLoadGlobalData';
import useResetAccountState from './useResetAccountState';
import { checkPushPermissionAndRegisterToken } from '@cardstack/models/firebase';
import { useLoadingOverlay } from '@cardstack/navigation';
import { appStateUpdate } from '@cardstack/redux/appState';
import { getCurrencyConversionsRates } from '@cardstack/services';
import { saveAccountEmptyState } from '@rainbow-me/handlers/localstorage/accountLocal';
import { setCurrencyConversionRates } from '@rainbow-me/redux/currencyConversion';
import logger from 'logger';

export default function useWalletManager() {
  const dispatch = useDispatch();

  const resetAccountState = useResetAccountState();
  const loadAccountData = useLoadAccountData();
  const loadCoingeckoCoins = useLoadCoingeckoCoins();
  const loadGlobalData = useLoadGlobalData();
  const initializeAccountData = useInitializeAccountData();

  const { network } = useAccountSettings();
  const { dismissLoadingOverlay } = useLoadingOverlay();

  const initializeWallet = useCallback(
    async (seedPhrase?: string) => {
      try {
        logger.sentry('Start wallet init');

        await resetAccountState();
        logger.sentry('resetAccountState ran ok');

        await dispatch(settingsLoadNetwork());

        logger.sentry('done loading network');

        // TODO: move to fallbackExplorer, shouldn't be related with initializating a wallet
        loadCoingeckoCoins();

        // TODO: move to rtk query
        const conversionsRates = await getCurrencyConversionsRates();

        await dispatch(setCurrencyConversionRates(conversionsRates));

        await dispatch(walletsLoadState());

        const walletAddress = await loadAddress();

        if (isNil(walletAddress)) {
          dispatch(appStateUpdate({ walletReady: true }));
          return null;
        }

        await dispatch(settingsUpdateAccountAddress(walletAddress));

        await loadGlobalData();
        logger.sentry('loaded global data...');
        await loadAccountData(network);
        logger.sentry('loaded account data', network);

        await initializeAccountData();

        await checkPushPermissionAndRegisterToken(walletAddress, seedPhrase);

        dispatch(appStateUpdate({ walletReady: true }));

        return walletAddress;
      } catch (error) {
        logger.sentry('Error while initializing wallet', error);
        captureException(error);

        return null;
      } finally {
        dismissLoadingOverlay();
        dispatch(appStateUpdate({ walletReady: true }));
      }
    },
    [
      resetAccountState,
      dispatch,
      loadCoingeckoCoins,
      network,
      initializeAccountData,
      loadGlobalData,
      loadAccountData,
      dismissLoadingOverlay,
    ]
  );

  const createNewWallet = useCallback(
    async ({
      color,
      name,
    }: Pick<CreateImportParams, 'color' | 'name'> = {}) => {
      try {
        const wallet = await createOrImportWallet({ color, name });

        const walletAddress = wallet?.address;

        await saveAccountEmptyState(
          true,
          walletAddress?.toLowerCase(),
          network
        );
        await initializeWallet();
      } catch (e) {
        logger.sentry('Error creating new wallet', e);
      }
    },
    [initializeWallet, network]
  );

  const importWallet = useCallback(
    async (params: CreateImportParams) => {
      try {
        const wallet = await createOrImportWallet(params);

        await initializeWallet(params.seed);

        return wallet;
      } catch (e) {
        logger.sentry('Error while importing wallet', e);

        Alert.alert('Something went wrong while importing. Please try again!');
      }
    },
    [initializeWallet]
  );

  const changeSelectedWallet = useCallback(
    async (wallet, address) => {
      const p1 = dispatch(walletsSetSelected(wallet));
      const p2 = dispatch(addressSetSelected(address));
      await Promise.all([p1, p2]);

      await initializeWallet();
    },
    [dispatch, initializeWallet]
  );

  return {
    initializeWallet,
    createNewWallet,
    importWallet,
    changeSelectedWallet,
  };
}
